# Use official Python slim image
FROM python:3.11-slim-bullseye

WORKDIR /app

# Install system deps for Postgres client & build, then upgrade all packages
RUN apt-get update && \
    apt-get install -y gcc libpq-dev && \
    apt-get upgrade -y && \
    rm -rf /var/lib/apt/lists/*

# Copy & install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

EXPOSE 8000

# Launch Uvicorn
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]