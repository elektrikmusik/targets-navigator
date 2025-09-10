#!/bin/bash

# Quick Start Script for Targets Navigator Docker Deployment
# This script provides easy commands for common Docker operations

set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROD_COMPOSE="docker-compose.prod.yml"
DEV_COMPOSE="docker-compose.yml"

# Functions
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Show usage
show_usage() {
    echo "Targets Navigator Docker Quick Start"
    echo "===================================="
    echo ""
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  dev         - Start development environment"
    echo "  prod        - Deploy to production"
    echo "  stop        - Stop all containers"
    echo "  logs        - Show application logs"
    echo "  status      - Show container status"
    echo "  health      - Check application health"
    echo "  clean       - Clean up Docker resources"
    echo "  build       - Build Docker images"
    echo "  shell       - Access container shell"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev      # Start development server"
    echo "  $0 prod     # Deploy to production"
    echo "  $0 logs     # View logs"
    echo "  $0 clean    # Clean up resources"
}

# Development environment
start_dev() {
    log "Starting development environment..."
    docker-compose -f "$DEV_COMPOSE" up -d
    success "Development environment started"
    log "Application available at: http://localhost:5173"
}

# Production deployment
deploy_prod() {
    log "Deploying to production..."
    if [ -f "./deploy-production.sh" ]; then
        ./deploy-production.sh
    else
        docker-compose -f "$PROD_COMPOSE" up -d
        success "Production deployment completed"
    fi
}

# Stop containers
stop_containers() {
    log "Stopping all containers..."
    docker-compose -f "$DEV_COMPOSE" down 2>/dev/null || true
    docker-compose -f "$PROD_COMPOSE" down 2>/dev/null || true
    success "All containers stopped"
}

# Show logs
show_logs() {
    log "Showing application logs..."
    if docker-compose -f "$PROD_COMPOSE" ps -q | grep -q .; then
        docker-compose -f "$PROD_COMPOSE" logs -f
    elif docker-compose -f "$DEV_COMPOSE" ps -q | grep -q .; then
        docker-compose -f "$DEV_COMPOSE" logs -f
    else
        warning "No running containers found"
    fi
}

# Show status
show_status() {
    log "Container status:"
    echo "=================="
    docker-compose -f "$DEV_COMPOSE" ps 2>/dev/null || true
    docker-compose -f "$PROD_COMPOSE" ps 2>/dev/null || true
    echo ""
    log "Docker system info:"
    echo "=================="
    docker system df
}

# Health check
check_health() {
    log "Checking application health..."
    
    # Check if any containers are running
    if ! docker ps -q | grep -q .; then
        warning "No containers are running"
        return 1
    fi
    
    # Try to access health endpoint
    if curl -f http://localhost:5173/health 2>/dev/null; then
        success "Application is healthy"
    elif curl -f http://localhost:80/health 2>/dev/null; then
        success "Application is healthy"
    else
        warning "Health check failed - application may not be responding"
    fi
}

# Clean up
cleanup() {
    log "Cleaning up Docker resources..."
    
    # Stop containers
    stop_containers
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    # Remove unused networks
    docker network prune -f
    
    success "Cleanup completed"
}

# Build images
build_images() {
    log "Building Docker images..."
    docker-compose -f "$DEV_COMPOSE" build
    docker-compose -f "$PROD_COMPOSE" build
    success "Images built successfully"
}

# Access container shell
access_shell() {
    log "Accessing container shell..."
    
    if docker-compose -f "$PROD_COMPOSE" ps -q | grep -q .; then
        docker-compose -f "$PROD_COMPOSE" exec targets-navigator sh
    elif docker-compose -f "$DEV_COMPOSE" ps -q | grep -q .; then
        docker-compose -f "$DEV_COMPOSE" exec targets-navigator-dev sh
    else
        warning "No running containers found"
    fi
}

# Main script logic
case "${1:-help}" in
    "dev")
        start_dev
        ;;
    "prod")
        deploy_prod
        ;;
    "stop")
        stop_containers
        ;;
    "logs")
        show_logs
        ;;
    "status")
        show_status
        ;;
    "health")
        check_health
        ;;
    "clean")
        cleanup
        ;;
    "build")
        build_images
        ;;
    "shell")
        access_shell
        ;;
    "help"|*)
        show_usage
        ;;
esac
