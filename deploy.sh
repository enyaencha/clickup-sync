#!/bin/bash

# Deployment script for ClickUp Sync System

set -e

ENVIRONMENT=${1:-development}
echo "🚀 Deploying ClickUp Sync System to $ENVIRONMENT environment..."

# Load environment variables
if [ -f ".env.$ENVIRONMENT" ]; then
    # shellcheck source=/dev/null
    source ".env.$ENVIRONMENT"
else
    echo "⚠️  No environment file found for $ENVIRONMENT, using defaults"
fi

# Build frontend
echo "📦 Building frontend..."
cd frontend || exit 1
npm ci
npm run build
cd .. || exit 1

# Build backend
echo "📦 Preparing backend..."
cd backend || exit 1
npm ci
cd .. || exit 1

# Database migration
echo "🗄️ Running database migrations..."
cd database || exit 1
node migrate.js
node seed.js
cd .. || exit 1

if [ "$ENVIRONMENT" = "production" ]; then
    echo "🐳 Starting production deployment with Docker..."
    docker-compose -f docker-compose.prod.yml up -d --build
else
    echo "🔧 Starting development servers..."
    # Start backend
    cd backend || exit 1
    npm run dev &
    BACKEND_PID=$!
    
    # Start frontend
    cd ../frontend || exit 1
    npm start &
    FRONTEND_PID=$!
    
    cd .. || exit 1
    
    echo "✅ Development servers started"
    echo "Backend PID: $BACKEND_PID"
    echo "Frontend PID: $FRONTEND_PID"
    echo "Access the application at http://localhost:3001"
fi

echo "✅ Deployment complete!"
