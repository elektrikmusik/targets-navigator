#!/bin/bash

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
