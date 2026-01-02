#!/bin/bash

# Deployment script for Stoger
# This script helps deploy the application to various environments

set -e

echo "🚀 Stoger Deployment Script"
echo "============================"

# Check for required commands
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Aborting." >&2; exit 1; }

# Function to deploy with Docker
deploy_docker() {
    echo "📦 Building and deploying with Docker..."
    
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Build and start containers
    docker-compose up -d --build
    
    echo "✅ Application deployed with Docker!"
    echo "Backend running at: http://localhost:3001"
    echo "Frontend build served by backend"
}

# Function to deploy locally
deploy_local() {
    echo "🏗️  Building application locally..."
    
    # Install dependencies
    echo "Installing dependencies..."
    npm install
    
    # Build backend and frontend
    echo "Building backend..."
    npm run build:backend
    
    echo "Building frontend..."
    npm run build:frontend
    
    echo "✅ Build complete!"
    echo ""
    echo "To start the application:"
    echo "1. Set up your .env file in backend/ directory"
    echo "2. Start MongoDB"
    echo "3. Run: cd backend && npm start"
}

# Function to clean build artifacts
clean() {
    echo "🧹 Cleaning build artifacts..."
    rm -rf backend/dist
    rm -rf frontend/dist
    rm -rf node_modules
    rm -rf backend/node_modules
    rm -rf frontend/node_modules
    echo "✅ Clean complete!"
}

# Main menu
case "${1:-menu}" in
    docker)
        deploy_docker
        ;;
    local)
        deploy_local
        ;;
    clean)
        clean
        ;;
    *)
        echo "Usage: $0 {docker|local|clean}"
        echo ""
        echo "Commands:"
        echo "  docker - Deploy using Docker Compose"
        echo "  local  - Build for local deployment"
        echo "  clean  - Remove all build artifacts"
        exit 1
        ;;
esac
