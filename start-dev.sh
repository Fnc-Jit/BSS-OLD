#!/bin/bash

# Neo-BBS Development Server Startup Script
# This script starts both the frontend and backend servers

echo "🎃 Starting Neo-BBS Development Servers..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "${RED}👻 Shutting down servers...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Trap CTRL+C and call cleanup
trap cleanup INT TERM

# Start Backend Server
echo "${BLUE}🔧 Starting Backend Server...${NC}"
cd backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start Frontend Server
echo "${GREEN}🌐 Starting Frontend Server...${NC}"
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "${GREEN}✅ Servers are starting up!${NC}"
echo ""
echo "📍 Access your Neo-BBS at:"
echo "   Frontend: ${BLUE}http://localhost:3000${NC}"
echo "   Backend:  ${BLUE}http://localhost:8000${NC}"
echo "   API Docs: ${BLUE}http://localhost:8000/docs${NC}"
echo ""
echo "Press ${RED}CTRL+C${NC} to stop all servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
