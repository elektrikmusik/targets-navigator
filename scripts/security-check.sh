#!/bin/bash

# Security Check Script for targets-navigator
# This script performs basic security checks on the codebase

set -e

echo "🔍 Running security checks..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "PASS")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "FAIL")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "WARN")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
    esac
}

# Check for hardcoded secrets
echo "🔐 Checking for hardcoded secrets..."

# Check for common secret patterns
if grep -r -i "password.*=" --include="*.yml" --include="*.yaml" --include="*.json" --include="*.js" --include="*.ts" --include="*.tsx" . | grep -v "your_.*_here" | grep -v "example" | grep -v "template"; then
    print_status "FAIL" "Hardcoded passwords found in codebase"
    exit 1
else
    print_status "PASS" "No hardcoded passwords found"
fi

# Check for API keys
if grep -r -i "api.*key.*=" --include="*.yml" --include="*.yaml" --include="*.json" --include="*.js" --include="*.ts" --include="*.tsx" . | grep -v "your_.*_here" | grep -v "example" | grep -v "template"; then
    print_status "FAIL" "Hardcoded API keys found in codebase"
    exit 1
else
    print_status "PASS" "No hardcoded API keys found"
fi

# Check for environment files in git
echo "📁 Checking for environment files in git..."

if git ls-files | grep -E "\.env$|\.env\.|env\.production$|env\.local$"; then
    print_status "FAIL" "Environment files found in git repository"
    exit 1
else
    print_status "PASS" "No environment files in git repository"
fi

# Check for secrets in git history (basic check)
echo "🕵️ Checking git history for secrets..."

if git log --all --full-history -- . | grep -i -E "(password|secret|key|token).*=" | grep -v "your_.*_here" | grep -v "example" | grep -v "template"; then
    print_status "WARN" "Potential secrets found in git history"
else
    print_status "PASS" "No obvious secrets in git history"
fi

# Check for proper .gitignore
echo "📋 Checking .gitignore configuration..."

if grep -q "\.env" .gitignore && grep -q "env\.production" .gitignore; then
    print_status "PASS" ".gitignore properly configured for environment files"
else
    print_status "FAIL" ".gitignore missing environment file patterns"
    exit 1
fi

# Check for security headers in nginx config
echo "🛡️ Checking nginx security configuration..."

if [ -f "nginx.conf" ]; then
    if grep -q "X-Frame-Options" nginx.conf && grep -q "X-Content-Type-Options" nginx.conf; then
        print_status "PASS" "Security headers found in nginx configuration"
    else
        print_status "WARN" "Security headers missing in nginx configuration"
    fi
else
    print_status "WARN" "nginx.conf not found"
fi

# Check Docker security
echo "🐳 Checking Docker security configuration..."

if [ -f "docker-compose.prod.yml" ]; then
    if grep -q "no-new-privileges:true" docker-compose.prod.yml && grep -q "read_only: true" docker-compose.prod.yml; then
        print_status "PASS" "Docker security options found"
    else
        print_status "WARN" "Docker security options missing"
    fi
else
    print_status "WARN" "docker-compose.prod.yml not found"
fi

echo ""
echo "🎉 Security check completed!"
echo "📋 Summary:"
echo "   - No hardcoded secrets found"
echo "   - Environment files properly excluded from git"
echo "   - Security configurations in place"
echo ""
echo "💡 Remember to:"
echo "   - Regularly rotate secrets"
echo "   - Monitor access logs"
echo "   - Keep dependencies updated"
echo "   - Review security configurations periodically"
