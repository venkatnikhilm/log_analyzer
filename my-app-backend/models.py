
from datetime import datetime
from typing import Optional, List

from sqlalchemy import (
    Column, Integer, String, DateTime, BigInteger, Text, ForeignKey, JSON
)
from sqlalchemy.orm import relationship, declarative_base
from pydantic import BaseModel, Field
from passlib.context import CryptContext

# SQLAlchemy Base and password context
Base = declarative_base()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- ORM MODELS ---
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    salt = Column(String(32), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    files = relationship("File", back_populates="owner", cascade="all, delete")
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete")

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="refresh_tokens")

class File(Base):
    __tablename__ = "files"
    file_hash = Column(String(255), primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    file_name = Column(Text, nullable=False)
    file_size = Column(BigInteger, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="files")
    log_entries = relationship("LogEntry", back_populates="file", cascade="all, delete")
    ai_insight = relationship("AIInsight", back_populates="file", uselist=False, cascade="all, delete")

class LogEntry(Base):
    __tablename__ = "log_entries"
    id = Column(Integer, primary_key=True, index=True)
    file_hash = Column(String(255), ForeignKey("files.file_hash", ondelete="CASCADE"), nullable=False, index=True)
    timestamp = Column(DateTime, nullable=False)
    ip = Column(Text)
    method = Column(Text)
    uri = Column(Text)
    status = Column(Integer)
    bytes = Column(BigInteger)
    user_agent = Column(Text)
    referer = Column(Text)

    file = relationship("File", back_populates="log_entries")

class AIInsight(Base):
    __tablename__ = "ai_insights"
    id = Column(Integer, primary_key=True, index=True)
    file_hash = Column(String(255), ForeignKey("files.file_hash", ondelete="CASCADE"), unique=True, nullable=False)
    insights = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    file = relationship("File", back_populates="ai_insight")

# --- Pydantic SCHEMAS ---
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserSchema(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class MessageResponse(BaseModel):
    message: str

class RefreshTokenSchema(BaseModel):
    id: int
    user_id: int
    token: str
    created_at: datetime
    expires_at: datetime

    class Config:
        from_attributes = True

class FileSchema(BaseModel):
    file_hash: str
    user_id: int
    file_name: str
    file_size: int
    uploaded_at: datetime

    class Config:
        from_attributes = True

class LogEntrySchema(BaseModel):
    id: int
    file_hash: str
    timestamp: datetime
    ip: Optional[str]
    method: Optional[str]
    uri: Optional[str]
    status: Optional[int]
    bytes: Optional[int]
    user_agent: Optional[str]
    referer: Optional[str]

    class Config:
        from_attributes = True

class AIInsightSchema(BaseModel):
    type: str
    title: str
    description: str
    severity: str
    recommendation: str
    confidence: int
    anomaly_logs: List[int] = Field(default_factory=list)

class AIInsightResponse(BaseModel):
    insights: List[AIInsightSchema]

    class Config:
        from_attributes = True