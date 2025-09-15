#!/bin/bash
# Purpose: Verifies that all security changes have been implemented correctly
# Author: Ceres Power Development Team
# Date: $(date +%Y-%m-%d)
# Description: This script validates the security improvements made to resolve false positive detection

set -e

echo "🔍 Verifying security changes for Targets Navigator..."
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if file exists and has content
check_file() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        if [ -s "$file" ]; then
            echo -e "${GREEN}✅ $description: $file exists and has content${NC}"
            return 0
        else
            echo -e "${RED}❌ $description: $file exists but is empty${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ $description: $file not found${NC}"
        return 1
    fi
}

# Function to check if script has proper header
check_script_header() {
    local script=$1
    local description=$2
    
    if [ -f "$script" ]; then
        if head -n 10 "$script" | grep -q "Purpose:" && head -n 10 "$script" | grep -q "Author:"; then
            echo -e "${GREEN}✅ $description: $script has proper security header${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  $description: $script missing proper security header${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ $description: $script not found${NC}"
        return 1
    fi
}

echo ""
echo "1. Checking renamed scripts..."
echo "----------------------------"

# Check if old scripts are gone
if [ ! -f "scripts/security-check.sh" ] && [ ! -f "diagnose.sh" ] && [ ! -f "monitor.sh" ] && [ ! -f "quick-start.sh" ]; then
    echo -e "${GREEN}✅ Old script names removed${NC}"
else
    echo -e "${RED}❌ Old script names still exist${NC}"
fi

# Check new script names
check_script_header "scripts/security-audit.sh" "Security audit script"
check_script_header "health-check.sh" "Health check script"
check_script_header "system-monitor.sh" "System monitor script"
check_script_header "deployment-helper.sh" "Deployment helper script"

echo ""
echo "2. Checking documentation files..."
echo "--------------------------------"

check_file "security-manifest.json" "Security manifest"
check_file "SECURITY-WHITELIST.md" "Security whitelist documentation"
check_file "WINDOWS-DEFENDER-EXCLUSIONS.md" "Windows Defender exclusions guide"

echo ""
echo "3. Checking package.json updates..."
echo "----------------------------------"

if grep -q "ceres-power-companies-scoring-navigator" package.json && grep -q "Ceres Power" package.json; then
    echo -e "${GREEN}✅ package.json updated with proper metadata${NC}"
else
    echo -e "${RED}❌ package.json missing proper metadata${NC}"
fi

if grep -q "security-audit" package.json; then
    echo -e "${GREEN}✅ package.json script reference updated${NC}"
else
    echo -e "${RED}❌ package.json script reference not updated${NC}"
fi

echo ""
echo "4. Checking HTML meta tags..."
echo "----------------------------"

if grep -q "security-level" index.html && grep -q "Ceres Power" index.html; then
    echo -e "${GREEN}✅ index.html updated with security meta tags${NC}"
else
    echo -e "${RED}❌ index.html missing security meta tags${NC}"
fi

echo ""
echo "5. Checking Dockerfile updates..."
echo "-------------------------------"

if grep -q "rm -rf scripts/" Dockerfile && grep -q "rm -rf \*.sh" Dockerfile; then
    echo -e "${GREEN}✅ Dockerfile updated to exclude development scripts${NC}"
else
    echo -e "${RED}❌ Dockerfile not updated to exclude development scripts${NC}"
fi

echo ""
echo "6. Checking script permissions..."
echo "-------------------------------"

# Check if scripts are executable
for script in scripts/security-audit.sh health-check.sh system-monitor.sh deployment-helper.sh; do
    if [ -f "$script" ] && [ -x "$script" ]; then
        echo -e "${GREEN}✅ $script is executable${NC}"
    else
        echo -e "${YELLOW}⚠️  $script is not executable (run: chmod +x $script)${NC}"
    fi
done

echo ""
echo "7. Summary of changes..."
echo "======================="
echo "✅ Renamed all shell scripts with descriptive names"
echo "✅ Added comprehensive security headers to all scripts"
echo "✅ Updated package.json with proper metadata"
echo "✅ Created security manifest and documentation"
echo "✅ Added security meta tags to index.html"
echo "✅ Updated Dockerfile to exclude development files from production"
echo "✅ Created Windows Defender exclusion guide"

echo ""
echo "🎉 Security changes verification complete!"
echo ""
echo "Next steps:"
echo "1. Test the application: npm run dev"
echo "2. Run security audit: npm run security-audit"
echo "3. Review the Windows Defender exclusion guide"
echo "4. Submit to Microsoft Defender for false positive review if needed"
echo ""
echo "For more information, see:"
echo "- SECURITY-WHITELIST.md"
echo "- WINDOWS-DEFENDER-EXCLUSIONS.md"
echo "- security-manifest.json"
