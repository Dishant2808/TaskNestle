#!/bin/bash

echo "🚀 Starting Task Management Tool..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Check if MongoDB is running
echo "🔍 Checking MongoDB..."
if ! check_port 27017; then
    echo -e "${YELLOW}⚠️  MongoDB is not running on port 27017${NC}"
    echo "Please start MongoDB:"
    echo "  - Local: mongod"
    echo "  - Or use MongoDB Atlas (cloud)"
    echo ""
fi

# Start backend
echo "🔧 Starting backend server..."
cd backend

if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Backend .env file not found. Please run setup.sh first.${NC}"
    exit 1
fi

if check_port 5000; then
    echo -e "${YELLOW}⚠️  Port 5000 is already in use. Backend might already be running.${NC}"
else
    echo -e "${BLUE}📡 Starting backend on http://localhost:5000${NC}"
    npm run dev &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
fi

# Wait a moment for backend to start
sleep 3
blmbeusing and 
# Start frontend
echo "🔧 Starting frontend server..."
cd ../frontend

if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Frontend .env file not found. Please run setup.sh first.${NC}"
    exit 1
fi

if check_port 3000; then
    echo -e "${YELLOW}⚠️  Port 3000 is already in use. Frontend might already be running.${NC}"
else
    echo -e "${BLUE}📡 Starting frontend on http://localhost:3000${NC}"
    npm start &
    FRONTEND_PID=$!
    echo "Frontend PID: $FRONTEND_PID"
fi

echo ""
echo -e "${GREEN}🎉 Both servers are starting!${NC}"
echo ""
echo "🌐 Backend API: http://localhost:5000"
echo "🌐 Frontend App: http://localhost:3000"
echo ""
echo "📋 To stop the servers:"
echo "  - Press Ctrl+C in this terminal"
echo "  - Or kill the processes: kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "🔍 Check server status:"
echo "  - Backend health: curl http://localhost:5000/health"
echo "  - Frontend: Open http://localhost:3000 in your browser"
echo ""

# Keep the script running
wait
