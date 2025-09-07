#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting deployment...${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Pull latest changes
echo -e "${YELLOW}Pulling latest changes...${NC}"
git pull origin main

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm ci --legacy-peer-deps

# Build the application
echo -e "${YELLOW}Building application...${NC}"
npm run build

# Stop existing containers
echo -e "${YELLOW}Stopping existing containers...${NC}"
docker-compose -f docker-compose.prod.yml down

# Build and start new containers
echo -e "${YELLOW}Building and starting new containers...${NC}"
docker-compose -f docker-compose.prod.yml up -d --build

# Clean up old images
echo -e "${YELLOW}Cleaning up old Docker images...${NC}"
docker system prune -f

# Check if the application is running
echo -e "${YELLOW}Checking application status...${NC}"
sleep 5
if curl -f http://localhost > /dev/null 2>&1; then
    echo -e "${GREEN}Deployment successful! Application is running.${NC}"
else
    echo -e "${RED}Deployment failed! Application is not responding.${NC}"
    exit 1
fi

echo -e "${GREEN}Deployment completed!${NC}"
