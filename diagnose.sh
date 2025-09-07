#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Targets Navigator Deployment Diagnosis ===${NC}"
echo "Timestamp: $(date)"
echo ""

# Function to check status
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
        return 0
    else
        echo -e "${RED}❌ $1${NC}"
        return 1
    fi
}

# 1. Check if we're in the right directory
echo -e "${YELLOW}1. Checking directory...${NC}"
if [ -f "package.json" ] && [ -f "docker-compose.prod.yml" ]; then
    check_status "In correct application directory"
else
    echo -e "${RED}❌ Not in application directory. Please run from /opt/targets-navigator${NC}"
    exit 1
fi

# 2. Check Git status
echo -e "${YELLOW}2. Checking Git status...${NC}"
if [ -d ".git" ]; then
    check_status "Git repository found"
    echo "Current branch: $(git branch --show-current)"
    echo "Latest commit: $(git log --oneline -1)"
else
    echo -e "${RED}❌ Not a git repository${NC}"
fi

# 3. Check required files
echo -e "${YELLOW}3. Checking required files...${NC}"
files=("docker-compose.prod.yml" ".env.production" "nginx.conf" "Dockerfile")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        check_status "$file exists"
    else
        echo -e "${RED}❌ $file missing${NC}"
    fi
done

# 4. Check Docker
echo -e "${YELLOW}4. Checking Docker...${NC}"
if command -v docker &> /dev/null; then
    check_status "Docker is installed"
    if docker info &> /dev/null; then
        check_status "Docker is running"
    else
        echo -e "${RED}❌ Docker is not running${NC}"
    fi
else
    echo -e "${RED}❌ Docker is not installed${NC}"
fi

# 5. Check Docker Compose
echo -e "${YELLOW}5. Checking Docker Compose...${NC}"
if command -v docker-compose &> /dev/null; then
    check_status "Docker Compose is installed"
else
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
fi

# 6. Check containers
echo -e "${YELLOW}6. Checking containers...${NC}"
if docker-compose -f docker-compose.prod.yml ps &> /dev/null; then
    check_status "Docker Compose file is valid"
    echo "Container status:"
    docker-compose -f docker-compose.prod.yml ps
else
    echo -e "${RED}❌ Docker Compose file has issues${NC}"
fi

# 7. Check application health
echo -e "${YELLOW}7. Checking application health...${NC}"
if curl -f http://localhost > /dev/null 2>&1; then
    check_status "Application is responding"
else
    echo -e "${RED}❌ Application is not responding${NC}"
fi

# 8. Check system resources
echo -e "${YELLOW}8. Checking system resources...${NC}"
echo "Disk space:"
df -h | grep -E "(Filesystem|/dev/)"
echo ""
echo "Memory usage:"
free -h
echo ""

# 9. Check recent logs
echo -e "${YELLOW}9. Checking recent logs...${NC}"
if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "Recent application logs:"
    docker-compose -f docker-compose.prod.yml logs --tail=10
else
    echo -e "${RED}❌ No running containers to check logs${NC}"
fi

# 10. Recommendations
echo -e "${YELLOW}10. Recommendations:${NC}"
if ! curl -f http://localhost > /dev/null 2>&1; then
    echo "• Application is not responding. Try: docker-compose -f docker-compose.prod.yml restart"
fi

if ! docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "• No containers running. Try: docker-compose -f docker-compose.prod.yml up -d"
fi

if [ ! -f ".env.production" ]; then
    echo "• Environment file missing. Create .env.production with your Supabase credentials"
fi

echo ""
echo -e "${BLUE}=== Diagnosis Complete ===${NC}"
echo "For more help, check TROUBLESHOOTING.md"
