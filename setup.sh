#!/bin/bash

# LogAnalyzer Setup Script
# This script sets up the entire LogAnalyzer application with Docker

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Docker installation
check_docker() {
    print_status "Checking Docker installation..."
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        print_status "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if ! command_exists docker-compose; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        print_status "Visit: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    # Check if Docker daemon is running
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker daemon is not running. Please start Docker."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are properly installed and running."
}

# Function to create environment file
create_env_file() {
    print_status "Creating environment file..."
    
    if [ ! -f .env ]; then
        cat > .env << EOF
# LogAnalyzer Environment Variables
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
EOF
        print_success "Created .env file with default values."
        print_warning "Please update the GEMINI_API_KEY in .env file with your actual API key."
    else
        print_status ".env file already exists."
    fi
}

# Function to check and create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    # Create logs directory if it doesn't exist
    mkdir -p logs
    
    print_success "Directories created successfully."
}

# Function to build and start containers
start_containers() {
    print_status "Building and starting Docker containers..."
    
    # Stop any existing containers
    print_status "Stopping any existing containers..."
    docker-compose down --remove-orphans 2>/dev/null || true
    
    # Build and start containers
    print_status "Building containers (this may take a few minutes)..."
    docker-compose up --build -d
    
    print_success "Containers started successfully!"
}

# Function to wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for database
    print_status "Waiting for database to be ready..."
    timeout=60
    counter=0
    while ! docker-compose exec -T db pg_isready -U appuser -d loganalyzer >/dev/null 2>&1; do
        sleep 1
        counter=$((counter + 1))
        if [ $counter -ge $timeout ]; then
            print_error "Database failed to start within $timeout seconds."
            exit 1
        fi
    done
    print_success "Database is ready."
    
    # Wait for backend
    print_status "Waiting for backend to be ready..."
    timeout=60
    counter=0
    while ! curl -s http://localhost:8000/health >/dev/null 2>&1; do
        sleep 2
        counter=$((counter + 2))
        if [ $counter -ge $timeout ]; then
            print_error "Backend failed to start within $timeout seconds."
            exit 1
        fi
    done
    print_success "Backend is ready."
    
    # Wait for frontend
    print_status "Waiting for frontend to be ready..."
    timeout=60
    counter=0
    while ! curl -s http://localhost:3000 >/dev/null 2>&1; do
        sleep 2
        counter=$((counter + 2))
        if [ $counter -ge $timeout ]; then
            print_error "Frontend failed to start within $timeout seconds."
            exit 1
        fi
    done
    print_success "Frontend is ready."
}

# Function to display final information
display_info() {
    echo ""
    echo "=========================================="
    echo "🎉 LogAnalyzer Setup Complete!"
    echo "=========================================="
    echo ""
    echo "📊 Application URLs:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:8000"
    echo "   API Documentation: http://localhost:8000/docs"
    echo ""
    echo "🗄️  Database:"
    echo "   Host: localhost"
    echo "   Port: 5432"
    echo "   Database: loganalyzer"
    echo "   Username: appuser"
    echo "   Password: secretpassword"
    echo ""
    echo "�� Useful Commands:"
    echo "   View logs: docker-compose logs -f"
    echo "   Stop services: docker-compose down"
    echo "   Restart services: docker-compose restart"
    echo "   Rebuild: docker-compose up --build"
    echo ""
    echo "⚠️  Important Notes:"
    echo "   1. Update GEMINI_API_KEY in .env file for AI features"
    echo "   2. Change JWT_SECRET in production"
    echo "   3. Upload Nginx log files through the web interface"
    echo ""
    echo "�� Happy Log Analysis!"
    echo ""
}

# Function to check if services are running
check_services() {
    print_status "Checking if all services are running..."
    
    if docker-compose ps | grep -q "Up"; then
        print_success "All services are running!"
        return 0
    else
        print_error "Some services are not running."
        return 1
    fi
}

# Function to show logs
show_logs() {
    print_status "Showing recent logs..."
    docker-compose logs --tail=20
}

# Main setup function
main() {
    echo "=========================================="
    echo "🚀 LogAnalyzer Setup Script"
    echo "=========================================="
    echo ""
    
    # Check prerequisites
    check_docker
    
    # Create environment file
    create_env_file
    
    # Create directories
    create_directories
    
    # Start containers
    start_containers
    
    # Wait for services
    wait_for_services
    
    # Check services
    if check_services; then
        display_info
        print_status "Setup completed successfully!"
    else
        print_error "Setup failed. Please check the logs:"
        show_logs
        exit 1
    fi
}

# Function to show help
show_help() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  setup     Run the complete setup (default)"
    echo "  start     Start the services"
    echo "  stop      Stop the services"
    echo "  restart   Restart the services"
    echo "  logs      Show service logs"
    echo "  status    Check service status"
    echo "  help      Show this help message"
    echo ""
}

# Parse command line arguments
case "${1:-setup}" in
    "setup")
        main
        ;;
    "start")
        print_status "Starting services..."
        docker-compose up -d
        print_success "Services started!"
        ;;
    "stop")
        print_status "Stopping services..."
        docker-compose down
        print_success "Services stopped!"
        ;;
    "restart")
        print_status "Restarting services..."
        docker-compose restart
        print_success "Services restarted!"
        ;;
    "logs")
        show_logs
        ;;
    "status")
        check_services
        docker-compose ps
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac 