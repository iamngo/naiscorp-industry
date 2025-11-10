#!/bin/bash

# Script tự động detect port Next.js và start ngrok
# Usage: ./scripts/start-ngrok.sh [port]

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  NGROK AUTO-START SCRIPT${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to check if port is in use
check_port() {
    local port=$1
    if command -v netstat >/dev/null 2>&1; then
        # Linux/Git Bash
        netstat -an 2>/dev/null | grep -q ":$port " && return 0 || return 1
    elif command -v lsof >/dev/null 2>&1; then
        # macOS
        lsof -i :$port >/dev/null 2>&1 && return 0 || return 1
    else
        # Fallback: try to connect
        (echo >/dev/tcp/localhost/$port) >/dev/null 2>&1 && return 0 || return 1
    fi
}

# Function to find Next.js port
find_nextjs_port() {
    echo -e "${YELLOW}🔍 Searching for Next.js server...${NC}"
    
    # Common Next.js ports
    local ports=(3000 3001 3002 3003 3004 3005)
    
    for port in "${ports[@]}"; do
        if check_port $port; then
            # Try to verify it's Next.js by checking if it responds
            if curl -s "http://localhost:$port" >/dev/null 2>&1; then
                echo -e "${GREEN}✅ Found Next.js running on port $port${NC}"
                echo $port
                return 0
            fi
        fi
    done
    
    echo -e "${RED}❌ Next.js server not found!${NC}"
    echo -e "${YELLOW}💡 Please start Next.js first: npm run dev${NC}"
    return 1
}

# Check if port is provided as argument
if [ -n "$1" ]; then
    PORT=$1
    echo -e "${BLUE}📌 Using provided port: $PORT${NC}"
    
    if ! check_port $PORT; then
        echo -e "${RED}❌ Port $PORT is not in use!${NC}"
        echo -e "${YELLOW}💡 Please start Next.js on port $PORT first${NC}"
        exit 1
    fi
else
    PORT=$(find_nextjs_port)
    if [ -z "$PORT" ]; then
        exit 1
    fi
fi

# Check if ngrok is installed
if ! command -v ngrok >/dev/null 2>&1; then
    echo -e "${RED}❌ ngrok not found!${NC}"
    echo -e "${YELLOW}💡 Install ngrok:${NC}"
    echo "   npm install -g ngrok"
    echo "   or download from https://ngrok.com/download"
    exit 1
fi

# Check if ngrok is already running
if pgrep -x ngrok >/dev/null 2>&1 || pgrep -f "ngrok http" >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  ngrok is already running!${NC}"
    echo -e "${YELLOW}💡 Stopping existing ngrok process...${NC}"
    pkill -x ngrok 2>/dev/null || pkill -f "ngrok http" 2>/dev/null || true
    sleep 1
fi

echo ""
echo -e "${GREEN}🚀 Starting ngrok tunnel on port $PORT...${NC}"
echo ""
echo -e "${BLUE}📋 Ngrok Dashboard: ${NC}http://localhost:4040"
echo -e "${BLUE}📋 Local Server: ${NC}http://localhost:$PORT"
echo ""
echo -e "${YELLOW}⚠️  Copy the forwarding URL from ngrok output above!${NC}"
echo ""

# Start ngrok
ngrok http $PORT

