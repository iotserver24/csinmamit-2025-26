#!/bin/bash

# CSI NMAMIT Full Stack Setup Script
# This script sets up both frontend and backend

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "======================================"
echo "  CSI NMAMIT Full Stack Setup"
echo "======================================"
echo -e "${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo -e "${RED}Error: Node.js version must be 16 or higher${NC}"
    echo "Current version: $(node -v)"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v) detected${NC}"
echo ""

# Frontend Setup
echo -e "${YELLOW}Setting up Frontend...${NC}"
echo "Installing frontend dependencies..."
npm install

if [ ! -f .env ]; then
    echo "Creating frontend .env file..."
    cp .env.example .env
    echo -e "${YELLOW}⚠ Please configure frontend .env file with your credentials${NC}"
else
    echo -e "${GREEN}✓ Frontend .env already exists${NC}"
fi

echo -e "${GREEN}✓ Frontend setup complete${NC}"
echo ""

# Backend Setup
echo -e "${YELLOW}Setting up Backend...${NC}"
cd backend

if [ ! -d node_modules ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo -e "${GREEN}✓ Backend dependencies already installed${NC}"
fi

if [ ! -f .env ]; then
    echo "Creating backend .env file..."
    cp .env.example .env
    echo -e "${YELLOW}⚠ Please configure backend .env file with your Razorpay credentials${NC}"
else
    echo -e "${GREEN}✓ Backend .env already exists${NC}"
fi

# Create logs directory
if [ ! -d logs ]; then
    mkdir -p logs
    echo -e "${GREEN}✓ Created logs directory${NC}"
fi

cd ..

echo ""
echo -e "${GREEN}"
echo "======================================"
echo "  Setup Complete! 🎉"
echo "======================================"
echo -e "${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "1. Configure Frontend Environment Variables:"
echo "   Edit: .env"
echo "   Required: Firebase credentials, Razorpay Key ID"
echo ""
echo "2. Configure Backend Environment Variables:"
echo "   Edit: backend/.env"
echo "   Required: Razorpay Key ID & Secret, Frontend URL"
echo ""
echo "3. Start the Backend Server:"
echo -e "   ${GREEN}npm run backend:dev${NC}"
echo "   (or: cd backend && npm run dev)"
echo ""
echo "4. Start the Frontend Server (in a new terminal):"
echo -e "   ${GREEN}npm run dev${NC}"
echo ""
echo "5. Test the Application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo "   Health:   http://localhost:5000/health"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "   - Frontend/Backend: README.md"
echo "   - Backend API:      backend/README.md"
echo "   - Quick Start:      backend/QUICK_START.md"
echo "   - Integration:      BACKEND_INTEGRATION.md"
echo ""
echo -e "${YELLOW}Important:${NC}"
echo "   - Never commit .env files"
echo "   - Use test Razorpay keys for development"
echo "   - Configure Firebase for data persistence"
echo ""
