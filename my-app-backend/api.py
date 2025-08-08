import os
import uuid
from datetime import datetime, timedelta
import re
import jwt
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status, Security, File, Form, UploadFile
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
import hashlib, json
from datetime import datetime
from fastapi import UploadFile, File as UploadParam, Form, status
from models import LogEntry
from ai import generate_insights
from db import engine, get_db
from pydantic import BaseModel
from models import (
    Base,
    User,
    UserCreate,
    UserSchema,
    RefreshToken,
    File,
    FileSchema,
    pwd_context,
    TokenResponse,
    LogEntrySchema,
    AIInsight,
    AIInsightResponse,
    AIInsightSchema as AIInsightsFormat,
)

class FileHashRequest(BaseModel):
    file_hash: str

# Load environment variables
load_dotenv()

# JWT and token settings
JWT_SECRET = os.getenv("JWT_SECRET", "supersecret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

app = FastAPI(title="Log Analyzer Backend")

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Log Analyzer Backend")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],  # or "*" if you're just testing
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    """Create all tables on startup."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/health")
async def health():
    return {"status": "ok"}


async def get_current_user(
    token: str = Security(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Decode JWT, validate user, or raise 401."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if not user_id:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    result = await db.execute(select(User).filter_by(id=int(user_id)))
    user = result.scalars().first()
    if not user:
        raise credentials_exception
    return user


@app.post("/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    """Register a new user, hashing their password with a per-user salt."""
    # Prevent duplicate email or username
    existing = await db.execute(
        select(User).filter(or_(User.email == user_in.email, User.username == user_in.username))
    )
    if existing.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already registered",
        )

    salt = os.urandom(16).hex()
    password_hash = pwd_context.hash(salt + user_in.password)

    user = User(
        username=user_in.username,
        email=user_in.email,
        salt=salt,
        password_hash=password_hash,
        created_at=datetime.utcnow(),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@app.post("/login", response_model=TokenResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    """Authenticate user and issue JWT + refresh token."""
    result = await db.execute(select(User).filter_by(email=form_data.username))
    user = result.scalars().first()

    if not user or not pwd_context.verify(user.salt + form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = jwt.encode(
        {"sub": str(user.id), "exp": expire},
        JWT_SECRET,
        algorithm=ALGORITHM,
    )

    # Store refresh token
    refresh_str = uuid.uuid4().hex
    refresh = RefreshToken(
        user_id=user.id,
        token=refresh_str,
        created_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(refresh)
    await db.commit()

    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/files", response_model=list[FileSchema])
async def list_files(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all uploaded files for the authenticated user."""
    result = await db.execute(select(File).filter_by(user_id=current_user.id))
    return result.scalars().all()

from fastapi import File as UploadParam, Form


LOG_PATTERN = re.compile(
    r'(?P<ip>\S+) \S+ \S+ \['
    r'(?P<timestamp>.*?)'
    r'\] "(?P<method>\S+) (?P<uri>\S+) \S+" '
    r'(?P<status>\d{3}) (?P<bytes>\d+) '
    r'"(?P<user_agent>.*?)"$'
)

from datetime import datetime, timezone
import re

LOG_PATTERN = re.compile(
    r'^(?P<ip>\S+) \S+ \S+ \[(?P<timestamp>[^\]]+)\] '
    r'"(?P<method>\S+) (?P<uri>\S+) \S+" '
    r'(?P<status>\d{3}) (?P<bytes>\d+) '
    r'"(?P<user_agent>[^"]+)"'
)

@app.post("/upload", response_model=FileSchema, status_code=201)
async def upload(
    file: UploadFile = UploadParam(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):

    #TODO: Check Auth

    # 1) Read & hash the raw bytes
    content = await file.read()
    file_hash = hashlib.sha256(content).hexdigest()

    # 2) If already saved, return it
    existing = await db.get(File, file_hash)
    if existing:
        return existing

    # 3) Decode and parse each line
    text = content.decode("utf-8", errors="ignore")
    entries = []
    for line in text.splitlines():
        m = LOG_PATTERN.match(line)
        if not m:
            continue #TODO: Fix
        # parse into timezone-aware dt
        ts = datetime.strptime(m.group("timestamp"), "%d/%b/%Y:%H:%M:%S %z")
        # convert to UTC and drop tzinfo so it's a naive datetime
        ts = ts.astimezone(timezone.utc).replace(tzinfo=None)

        entries.append({
            "file_hash":  file_hash,
            "timestamp":  ts,
            "ip":         m.group("ip"),
            "method":     m.group("method"),
            "uri":        m.group("uri"),
            "status":     int(m.group("status")),
            "bytes":      int(m.group("bytes")),
            "user_agent": m.group("user_agent"),
            "referer":    None,  # add your referer group if needed
        })

    # 4) Create the File row
    record = File(
        file_hash=file_hash,
        user_id=current_user.id,
        file_name=file.filename,
        file_size=len(content),
        uploaded_at=datetime.utcnow(),
    )
    db.add(record)
    await db.flush()

    # 5) Bulk-insert all LogEntry objects
    db.add_all(LogEntry(**e) for e in entries)

    # 6) Commit and return
    await db.commit()
    await db.refresh(record)
    return record

@app.post("/logs", response_model=list[LogEntrySchema])
async def get_logs(
  body: FileHashRequest,                # Pydantic with just file_hash: str
  current_user: User = Depends(get_current_user),
  db: AsyncSession = Depends(get_db)
):
  # 1) Optional: verify the file belongs to current_user
  # 2) SELECT * FROM LogEntry WHERE file_hash=body.file_hash
  result = await db.execute(select(LogEntry).filter_by(file_hash=body.file_hash))
  return result.scalars().all()

from pydantic import BaseModel
from models import AIInsight, AIInsightResponse  # make sure you have AIInsightResponse defined
from ai import generate_insights    # for now, let that just return []

class FileHashRequest(BaseModel):
    file_hash: str

@app.post("/analyse", response_model=AIInsightResponse)
async def analyse(
    body: FileHashRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):

    # TODO: Check Auth.
    try:
        # 1) Already analysed?
        q = await db.execute(select(AIInsight).filter_by(file_hash=body.file_hash))
        existing = q.scalars().first()
        if existing:
            return AIInsightResponse(insights=existing.insights)

        # 2) Fetch logs
        q = await db.execute(select(LogEntry).filter_by(file_hash=body.file_hash))
        entries = q.scalars().all()

        # 3) Stubbed AI call
        insights = generate_insights(entries)  # for now returns []
        if insights is None:
            raise HTTPException(500, "Analysis failed")

        # 4) Persist and return
        ai_rec = AIInsight(
            file_hash=body.file_hash,
            insights=insights,
            created_at=datetime.utcnow(),
        )
        db.add(ai_rec)
        await db.commit()

        return AIInsightResponse(insights=insights)
    except Exception as e:
        print("🛑 AI analysis error:", e, flush=True)
        raise HTTPException(status_code=500, detail="AI analysis failed")