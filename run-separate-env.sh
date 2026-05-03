#!/bin/bash

# Script to run the Challan project in a separate environment
# Uses different ports to avoid conflicts with other running projects

set -e

echo "🚀 Starting Challan project in separate environment..."
echo "📦 Ports:"
echo "   - Frontend: http://localhost:3001"
echo "   - Backend:  http://localhost:4001"
echo "   - Postgres: localhost:5433"
echo "   - Redis:    localhost:6380"
echo ""

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install Docker and docker-compose."
    exit 1
fi

# Export environment variables for the separate environment
export BACKEND_PORT=4000
export NEXT_PUBLIC_API_URL=http://localhost:4001

# Start services using docker-compose with override file
echo "🐳 Starting Docker containers..."
docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d

echo ""
echo "✅ Services started!"
echo ""
echo "📝 Access the application:"
echo "   Frontend: http://localhost:3001"
echo "   Backend API: http://localhost:4001/api"
echo "   API Docs: http://localhost:4001/api/docs"
echo ""
echo "To view logs: docker-compose -f docker-compose.yml -f docker-compose.override.yml logs -f"
echo "To stop: docker-compose -f docker-compose.yml -f docker-compose.override.yml down"
