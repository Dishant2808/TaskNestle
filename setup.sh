#!/bin/bash

echo "🚀 Setting up Task Management Tool..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js v14 or higher.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js and npm are installed${NC}"

# Backend setup
echo "🔧 Setting up backend..."
cd backend

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Backend package.json not found. Make sure you're in the correct directory.${NC}"
    exit 1
fi

echo "📦 Installing backend dependencies..."
npm install

if [ ! -f ".env" ]; then
    echo "📝 Creating backend environment file..."
    cp env.example .env
    echo -e "${YELLOW}⚠️  Please update backend/.env with your MongoDB URI and email credentials${NC}"
fi

echo -e "${GREEN}✅ Backend setup complete${NC}"

# Frontend setup
echo "🔧 Setting up frontend..."
cd ../frontend

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Frontend package.json not found. Make sure you're in the correct directory.${NC}"
    exit 1
fi

echo "📦 Installing frontend dependencies..."
npm install

if [ ! -f ".env" ]; then
    echo "📝 Creating frontend environment file..."
    cp env.example .env
    echo -e "${YELLOW}⚠️  Please update frontend/.env with your backend API URL${NC}"
fi

echo -e "${GREEN}✅ Frontend setup complete${NC}"

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Update backend/.env with your MongoDB URI and email credentials"
echo "2. Update frontend/.env with your backend API URL"
echo "3. Start MongoDB (if using local MongoDB)"
echo "4. Run the backend: cd backend && npm run dev"
echo "5. Run the frontend: cd frontend && npm start"
echo ""
echo "🌐 Backend will run at: http://localhost:5000"
echo "🌐 Frontend will run at: http://localhost:3000"
