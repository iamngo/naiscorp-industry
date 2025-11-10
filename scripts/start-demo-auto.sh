#!/bin/bash

# Script tự động start Next.js và ngrok
# Usage: ./scripts/start-demo-auto.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  STARTING DEMO (Next.js + Ngrok)${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if ngrok is installed
if ! command -v ngrok >/dev/null 2>&1; then
    echo -e "${RED}❌ ngrok not found!${NC}"
    echo -e "${YELLOW}💡 Install ngrok: npm install -g ngrok${NC}"
    exit 1
fi

# Start Next.js in background
echo -e "${YELLOW}[1/2] Starting Next.js server...${NC}"
npm run dev > /dev/null 2>&1 &
NEXTJS_PID=$!

echo -e "${GREEN}✅ Next.js started (PID: $NEXTJS_PID)${NC}"

# Wait for Next.js to start
echo -e "${YELLOW}⏳ Waiting for server to start...${NC}"
sleep 5

# Find Next.js port
PORT=3000
for p in 3000 3001 3002 3003 3004 3005; do
    if curl -s "http://localhost:$p" >/dev/null 2>&1; then
        PORT=$p
        break
    fi
done

echo -e "${GREEN}✅ Next.js running on port $PORT${NC}"

# Start ngrok
echo ""
echo -e "${YELLOW}[2/2] Starting ngrok tunnel...${NC}"
echo ""

# Use the start-ngrok script
./scripts/start-ngrok.sh $PORT

# Cleanup on exit
trap "kill $NEXTJS_PID 2>/dev/null || true" EXIT

