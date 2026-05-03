#!/bin/bash

# Script to run the Challan project locally in a separate environment
# Uses different ports to avoid conflicts with other running projects
# Assumes you have PostgreSQL and Redis running separately

set -e

echo "🚀 Starting Challan project in separate environment (local mode)..."
echo "📦 Ports:"
echo "   - Frontend: http://localhost:3001"
echo "   - Backend:  http://localhost:4001"
echo ""

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Load nvm if available and switch to Node 18+ (required for Next.js)
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh"
    # Use Node 18 or 20 if available (required for Next.js >= 18.17.0)
    if nvm list | grep -q "v18\|v20"; then
        NODE_VERSION=$(nvm list | grep -E "v(18|20)" | head -1 | awk '{print $1}' | sed 's/[->*]//g')
        if [ -n "$NODE_VERSION" ]; then
            echo "🔄 Switching to Node.js $NODE_VERSION (required for Next.js)..."
            nvm use "$NODE_VERSION" > /dev/null 2>&1
        fi
    fi
fi

# Set environment variables for separate ports
export BACKEND_PORT=4001
export NEXT_PUBLIC_API_URL=http://localhost:4001
export NODE_ENV=development

# Check if node_modules exist
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Start backend in background
echo "🔧 Starting backend on port 4001..."
cd backend
PORT=4001 BACKEND_PORT=4001 npm run start:dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend on port 3001..."
cd frontend
# Next.js accepts PORT env var or -p flag
PORT=3001 NEXT_PUBLIC_API_URL=http://localhost:4001 npm run dev -- -p 3001 > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Services started!"
echo ""
echo "📝 Access the application:"
echo "   Frontend: http://localhost:3001"
echo "   Backend API: http://localhost:4001/api"
echo "   API Docs: http://localhost:4001/api/docs"
echo ""
echo "📋 Process IDs:"
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "📄 Logs:"
echo "   Backend: tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Save PIDs to file for easy cleanup
echo "$BACKEND_PID $FRONTEND_PID" > .separate-env-pids

# Wait for user interrupt
trap "echo ''; echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; rm -f .separate-env-pids; exit" INT TERM

wait
