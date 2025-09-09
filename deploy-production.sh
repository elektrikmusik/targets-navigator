#!/bin/bash

# Production Deployment Script for Targets Navigator
# This script handles the complete production deployment process

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="targets-navigator"
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"
BACKUP_DIR="./backups"
LOG_FILE="./deployment.log"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed or not in PATH"
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed or not in PATH"
    fi
    
    if [ ! -f "$DOCKER_COMPOSE_FILE" ]; then
        error "Docker Compose file $DOCKER_COMPOSE_FILE not found"
    fi
    
    if [ ! -f "Dockerfile" ]; then
        error "Dockerfile not found"
    fi
    
    if [ ! -f "nginx.conf" ]; then
        error "nginx.conf not found"
    fi
    
    success "Prerequisites check passed"
}

# Create backup
create_backup() {
    log "Creating backup of current deployment..."
    
    mkdir -p "$BACKUP_DIR"
    BACKUP_NAME="backup-$(date +'%Y%m%d-%H%M%S')"
    
    if docker ps -q -f name="$APP_NAME" | grep -q .; then
        log "Creating container backup..."
        docker commit "$APP_NAME" "$APP_NAME:$BACKUP_NAME" || warning "Failed to create container backup"
    fi
    
    if [ -d "./dist" ]; then
        log "Creating dist backup..."
        tar -czf "$BACKUP_DIR/$BACKUP_NAME-dist.tar.gz" ./dist || warning "Failed to create dist backup"
    fi
    
    success "Backup created: $BACKUP_NAME"
}

# Build application
build_application() {
    log "Building application..."
    
    # Clean previous builds
    docker system prune -f --volumes || warning "Failed to clean Docker system"
    
    # Build the application
    docker-compose -f "$DOCKER_COMPOSE_FILE" build --no-cache --pull || error "Failed to build application"
    
    success "Application built successfully"
}

# Deploy application
deploy_application() {
    log "Deploying application..."
    
    # Stop existing containers
    docker-compose -f "$DOCKER_COMPOSE_FILE" down --remove-orphans || warning "Failed to stop existing containers"
    
    # Start new containers
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d || error "Failed to start application"
    
    success "Application deployed successfully"
}

# Health check
health_check() {
    log "Performing health check..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        log "Health check attempt $attempt/$max_attempts"
        
        if docker-compose -f "$DOCKER_COMPOSE_FILE" ps | grep -q "Up (healthy)"; then
            success "Application is healthy"
            return 0
        fi
        
        sleep 10
        ((attempt++))
    done
    
    error "Health check failed after $max_attempts attempts"
}

# Show deployment status
show_status() {
    log "Deployment Status:"
    echo "=================="
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
    echo ""
    
    log "Container Logs (last 20 lines):"
    echo "=============================="
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=20
    echo ""
    
    log "Resource Usage:"
    echo "=============="
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
}

# Cleanup old images
cleanup() {
    log "Cleaning up old Docker images..."
    
    # Remove dangling images
    docker image prune -f || warning "Failed to remove dangling images"
    
    # Remove unused images older than 24 hours
    docker image prune -a -f --filter "until=24h" || warning "Failed to remove old images"
    
    success "Cleanup completed"
}

# Main deployment function
main() {
    log "Starting production deployment for $APP_NAME"
    echo "=============================================="
    
    check_prerequisites
    create_backup
    build_application
    deploy_application
    health_check
    show_status
    cleanup
    
    success "Production deployment completed successfully!"
    log "Application is running and healthy"
    
    # Show useful commands
    echo ""
    log "Useful commands:"
    echo "==============="
    echo "View logs: docker-compose -f $DOCKER_COMPOSE_FILE logs -f"
    echo "Stop app:  docker-compose -f $DOCKER_COMPOSE_FILE down"
    echo "Restart:   docker-compose -f $DOCKER_COMPOSE_FILE restart"
    echo "Status:    docker-compose -f $DOCKER_COMPOSE_FILE ps"
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "build")
        check_prerequisites
        build_application
        ;;
    "health")
        health_check
        ;;
    "status")
        show_status
        ;;
    "cleanup")
        cleanup
        ;;
    "rollback")
        log "Rollback functionality not implemented yet"
        warning "Please manually restore from backup if needed"
        ;;
    *)
        echo "Usage: $0 {deploy|build|health|status|cleanup|rollback}"
        echo "  deploy  - Full deployment (default)"
        echo "  build   - Build only"
        echo "  health  - Health check only"
        echo "  status  - Show status"
        echo "  cleanup - Cleanup old images"
        echo "  rollback- Rollback (not implemented)"
        exit 1
        ;;
esac
