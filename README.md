# LogAnalyzer - AI-Powered Nginx Log Analysis Platform

A comprehensive web application for analyzing Nginx access logs with AI-powered security insights, designed for Security Operations Center (SOC) analysts and DevOps teams.

## 🚀 Features

### 📊 **Log Analysis**
- **Nginx Access Log Parsing**: Automatic parsing of standard Nginx access log format
- **Real-time Metrics**: Total requests, error rates, unique IPs, peak hours
- **Interactive Dashboard**: Visual charts and tables for log exploration
- **Raw Logs Table**: Color-coded log entries with security highlighting

### 🤖 **AI-Powered Security**
- **Threat Detection**: AI analysis using Google Gemini for security threats
- **Anomaly Detection**: Automatic identification of suspicious patterns
- **Security Scoring**: Confidence-based threat assessment
- **Detailed Insights**: Recommendations and affected log entries

### 🛡️ **Security Features**
- **JWT Authentication**: Secure token-based authentication
- **User Management**: Registration and login system
- **File Deduplication**: SHA256-based file hash checking
- **CORS Protection**: Secure cross-origin resource sharing

### 📈 **Visualization**
- **Timeline Charts**: Request patterns over time
- **Metrics Cards**: Key performance indicators
- **Status Code Highlighting**: Color-coded HTTP status codes
- **Responsive Design**: Works on desktop and mobile

## 🏗️ Architecture

```
LogAnalyzer/
├── my-app-backend/          # FastAPI Backend
│   ├── api.py              # Main API endpoints
│   ├── models.py           # Database models
│   ├── ai.py              # AI analysis logic
│   ├── db.py              # Database configuration
│   └── requirements.txt   # Python dependencies
├── soc-dashboard/          # Next.js Frontend
│   ├── app/               # Next.js app router
│   ├── components/        # React components
│   ├── lib/              # Utilities and API client
│   └── package.json      # Node.js dependencies
├── docker-compose.yml     # Container orchestration
├── init.sql              # Database initialization
└── setup.sh              # Automated setup script
```

## 🛠️ Technology Stack

### **Backend**
- **FastAPI**: Modern Python web framework
- **PostgreSQL**: Primary database with JSONB support
- **SQLAlchemy**: ORM for database operations
- **Google Gemini AI**: AI-powered log analysis
- **JWT**: Authentication and authorization

### **Frontend**
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Recharts**: Data visualization

### **Infrastructure**
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **PostgreSQL**: Database container

## 📋 Prerequisites

- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)
- **Git**
- **Google Gemini API Key** (for AI features)

## 🤖 AI Integration & Usage

### **Google Gemini AI Integration**
LogAnalyzer leverages Google's Gemini AI to provide intelligent analysis of Nginx access logs, transforming raw log data into actionable security insights.

### **AI Workflow Process**

```mermaid
graph TD
    A[Upload Nginx Logs] --> B[Parse Log Entries]
    B --> C[Extract Features]
    C --> D[Send to Gemini AI]
    D --> E[AI Analysis]
    E --> F[Generate Insights]
    F --> G[Store Results]
    G --> H[Display in Dashboard]
```


## 🚀 Quick Start

### **1. Clone the Repository**
```bash
git clone https://github.com/venkatnikhilm/log_analyzer.git
cd LogAnalyzer
```

### **2. Run the Setup Script**
```bash
chmod +x setup.sh
./setup.sh
```

### **3. Configure Environment Variables**
```bash
# Edit .env file
nano .env

# Update with your Gemini API key
GEMINI_API_KEY=your_actual_api_key_here
```

### **4. Access the Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔧 Manual Setup

### **1. Environment Configuration**
Create a `.env` file in the root directory:
```bash
# Database Configuration
DATABASE_URL=postgresql+asyncpg://appuser:secretpassword@localhost:5432/loganalyzer

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7

# Google Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### **2. Start Services**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### **3. Individual Service Management**
```bash
# Start specific service
docker-compose up -d backend
docker-compose up -d frontend
docker-compose up -d db

# Rebuild specific service
docker-compose up --build frontend

# View service logs
docker-compose logs frontend
docker-compose logs backend
```

## 📊 Usage Guide

### **1. User Registration & Login**
1. Navigate to http://localhost:3000
2. Register a new account or login with existing credentials
3. Access the dashboard after successful authentication

### **2. Upload Log Files**
1. Click "Upload Log" button in the dashboard
2. Select your Nginx access log file
3. Wait for automatic parsing and processing
4. View parsed logs in the dashboard

### **3. Analyze Logs**
1. Select an uploaded file from the dropdown
2. Click "AI Insights" to run security analysis
3. Review threat findings and recommendations
4. Explore raw logs and metrics

### **4. View Analytics**
- **Metrics Cards**: Overview of key statistics
- **Timeline Chart**: Request patterns over time
- **Raw Logs Table**: Detailed log entries with highlighting
- **AI Insights Panel**: Security analysis results

## 🔒 Security Considerations

### **Production Deployment**
1. **Change Default Secrets**: Update JWT_SECRET and database passwords
2. **Use HTTPS**: Configure SSL/TLS certificates
3. **Environment Variables**: Store sensitive data in environment variables
4. **Database Security**: Use strong passwords and network isolation
5. **API Key Management**: Rotate Gemini API keys regularly

### **API Security**
- JWT tokens with configurable expiration
- CORS protection for cross-origin requests
- Input validation and sanitization
- Rate limiting (recommended for production)

## 🗄️ Database Schema

### **Users Table**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  salt VARCHAR(32) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### **Files Table**
```sql
CREATE TABLE files (
  file_hash VARCHAR(255) PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### **Log Entries Table**
```sql
CREATE TABLE log_entries (
  id SERIAL PRIMARY KEY,
  file_hash VARCHAR(255) NOT NULL REFERENCES files(file_hash),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  ip TEXT,
  method TEXT,
  uri TEXT,
  status INTEGER,
  bytes BIGINT,
  user_agent TEXT,
  referer TEXT
);
```

### **AI Insights Table**
```sql
CREATE TABLE ai_insights (
  id SERIAL PRIMARY KEY,
  file_hash VARCHAR(255) UNIQUE NOT NULL REFERENCES files(file_hash),
  insights JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## 🔧 Development

### **Local Development Setup**
```bash
# Backend Development
cd my-app-backend
pip install -r requirements.txt
uvicorn api:app --reload --host 0.0.0.0 --port 8000

# Frontend Development
cd soc-dashboard
npm install
npm run dev
```

### **Database Development**
```bash
# Connect to PostgreSQL
docker-compose exec db psql -U appuser -d loganalyzer

# View tables
\dt

# Sample queries
SELECT COUNT(*) FROM log_entries;
SELECT * FROM ai_insights LIMIT 5;
```

## 🔌 API Endpoints

### **Authentication**
- `POST /register` - User registration
- `POST /login` - User authentication
- `GET /health` - Health check

### **File Management**
- `POST /upload` - Upload log file
- `GET /files` - List uploaded files
- `POST /logs` - Get parsed logs for a file

### **Analysis**
- `POST /analyse` - Run AI analysis on log file

## 🐛 Troubleshooting

### **Common Issues**

**1. Docker Build Fails**
```bash
# Clean Docker cache
docker system prune -a
docker-compose up --build
```

**2. Database Connection Issues**
```bash
# Check database status
docker-compose ps db
docker-compose logs db

# Restart database
docker-compose restart db
```

**3. Frontend Not Loading**
```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up --build frontend
```

**4. AI Analysis Not Working**
- Verify Gemini API key in `.env` file
- Check API quota and limits
- Review backend logs for errors

### **Log Locations**
- **Application Logs**: `docker-compose logs -f`
- **Database Logs**: `docker-compose logs db`
- **Backend Logs**: `docker-compose logs backend`
- **Frontend Logs**: `docker-compose logs frontend`




**Happy Log Analysis! 🚀** 
