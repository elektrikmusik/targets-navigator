#!/bin/bash
# Purpose: Monitors application health and system resources
# Author: Ceres Power Development Team
# Date: $(date +%Y-%m-%d)
# Description: This script is part of the Targets Navigator application deployment process
#              and provides real-time monitoring of Docker containers, system resources,
#              and application performance metrics.
# Security Level: Internal use only - Production monitoring and maintenance

# Monitor application health
echo "=== Application Status ==="
docker-compose -f docker-compose.prod.yml ps

echo -e "\n=== Application Logs (last 50 lines) ==="
docker-compose -f docker-compose.prod.yml logs --tail=50

echo -e "\n=== System Resources ==="
df -h
free -h

echo -e "\n=== Docker Images ==="
docker images

echo -e "\n=== Application Health Check ==="
if curl -f http://localhost > /dev/null 2>&1; then
    echo "✅ Application is responding"
else
    echo "❌ Application is not responding"
fi
