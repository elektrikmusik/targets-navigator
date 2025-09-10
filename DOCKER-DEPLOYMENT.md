# Docker Production Deployment Guide

This guide covers the complete Docker setup for production deployment of the Targets Navigator application.

## 🚀 Quick Start

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- 2GB+ RAM available
- 10GB+ disk space

### Basic Deployment

```bash
# Clone and navigate to project
git clone <repository-url>
cd targets-navigator

# Copy environment template
cp env.production.template .env.production

# Edit environment variables
nano .env.production

# Deploy with production script
./deploy-production.sh
```

## 📁 File Structure

```
targets-navigator/
├── Dockerfile                 # Multi-stage production build
├── docker-compose.yml         # Development setup
├── docker-compose.prod.yml    # Production setup with monitoring
├── nginx.conf                 # Optimized Nginx configuration
├── .dockerignore              # Build context optimization
├── deploy-production.sh       # Production deployment script
├── env.production.template    # Environment variables template
└── monitoring/                # Monitoring configuration
    ├── prometheus.yml         # Prometheus configuration
    └── grafana/               # Grafana dashboards
```

## 🐳 Docker Configuration

### Dockerfile Features

- **Multi-stage build** for minimal production image
- **Node.js 20 Alpine** for build stage
- **Nginx 1.25 Alpine** for production
- **Security hardening** with non-root user
- **Health checks** for container monitoring
- **Signal handling** with dumb-init
- **Optimized caching** for faster builds

### Production Optimizations

- **Layer caching** for faster rebuilds
- **Minimal attack surface** with Alpine Linux
- **Security headers** and rate limiting
- **Gzip compression** for better performance
- **Static asset caching** with long TTL
- **Resource limits** to prevent OOM

## 🔧 Configuration

### Environment Variables

Copy `env.production.template` to `.env.production` and configure:

```bash
# Application
NODE_ENV=production
VITE_APP_ENV=production

# Supabase
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Performance
GZIP_COMPRESSION=on
CACHE_STATIC_ASSETS=1y
RATE_LIMIT_API=10r/s
```

### Nginx Configuration

The `nginx.conf` includes:

- **Security headers** (HSTS, CSP, XSS protection)
- **Rate limiting** for API and static files
- **Gzip compression** for all text assets
- **Static asset caching** with immutable headers
- **Health check endpoint** at `/health`
- **Client-side routing** support

## 🚀 Deployment Commands

### Production Deployment

```bash
# Full deployment with health checks
./deploy-production.sh

# Build only
./deploy-production.sh build

# Health check only
./deploy-production.sh health

# Show status
./deploy-production.sh status

# Cleanup old images
./deploy-production.sh cleanup
```

### Manual Docker Commands

```bash
# Build image
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

## 📊 Monitoring

### Prometheus (Optional)

Enable monitoring with:

```bash
# Start with monitoring
docker-compose -f docker-compose.prod.yml --profile monitoring up -d
```

Access Prometheus at: `https://prometheus.targets.srv903155.hstgr.cloud`

### Grafana (Optional)

Access Grafana at: `https://grafana.targets.srv903155.hstgr.cloud`

Default credentials:

- Username: `admin`
- Password: `admin123`

### Health Checks

- **Container health**: Docker health check every 30s
- **Application health**: HTTP endpoint at `/health`
- **Traefik health**: Automatic load balancer health checks

## 🔒 Security Features

### Container Security

- **Non-root user** execution
- **Read-only filesystem** with tmpfs for writable areas
- **Capability dropping** (removes all, adds only required)
- **No new privileges** policy
- **Resource limits** to prevent resource exhaustion

### Network Security

- **Rate limiting** on API and static endpoints
- **Security headers** on all responses
- **Hidden file protection** (denies access to dotfiles)
- **Config file protection** (denies access to sensitive files)

### Application Security

- **Content Security Policy** headers
- **XSS protection** headers
- **Clickjacking protection** with X-Frame-Options
- **MIME type sniffing** protection

## 📈 Performance Optimizations

### Build Optimizations

- **Multi-stage builds** reduce final image size
- **Layer caching** speeds up rebuilds
- **Dockerignore** excludes unnecessary files
- **Alpine Linux** for minimal base images

### Runtime Optimizations

- **Gzip compression** for all text assets
- **Static asset caching** with 1-year TTL
- **HTML caching** with 1-hour TTL
- **Nginx worker optimization** with auto-scaling
- **Keep-alive connections** for better performance

### Resource Management

- **Memory limits**: 512MB max, 256MB reserved
- **CPU limits**: 0.5 cores max, 0.25 cores reserved
- **Log rotation**: 10MB max, 3 files retained
- **Automatic cleanup** of old images

## 🛠️ Troubleshooting

### Common Issues

1. **Build failures**

   ```bash
   # Clean Docker cache
   docker system prune -a -f
   ./deploy-production.sh build
   ```

2. **Health check failures**

   ```bash
   # Check container logs
   docker-compose -f docker-compose.prod.yml logs

   # Check health endpoint
   curl http://localhost/health
   ```

3. **Permission issues**

   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   chmod +x deploy-production.sh
   ```

4. **Port conflicts**

   ```bash
   # Check port usage
   netstat -tulpn | grep :80

   # Stop conflicting services
   sudo systemctl stop nginx
   ```

### Log Analysis

```bash
# Application logs
docker-compose -f docker-compose.prod.yml logs targets-navigator

# Nginx access logs
docker-compose -f docker-compose.prod.yml exec targets-navigator cat /var/log/nginx/access.log

# Nginx error logs
docker-compose -f docker-compose.prod.yml exec targets-navigator cat /var/log/nginx/error.log
```

### Performance Monitoring

```bash
# Container resource usage
docker stats

# Container health status
docker-compose -f docker-compose.prod.yml ps

# System resource usage
htop
```

## 🔄 Updates and Maintenance

### Application Updates

```bash
# Pull latest changes
git pull origin main

# Deploy updates
./deploy-production.sh
```

### Security Updates

```bash
# Update base images
docker-compose -f docker-compose.prod.yml pull

# Rebuild with updates
./deploy-production.sh build
./deploy-production.sh
```

### Backup and Recovery

```bash
# Create backup
./deploy-production.sh

# Restore from backup (manual)
docker load < backup-image.tar
docker-compose -f docker-compose.prod.yml up -d
```

## 📋 Production Checklist

Before going live, ensure:

- [ ] Environment variables configured
- [ ] SSL certificates valid
- [ ] Domain DNS configured
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Backup strategy in place
- [ ] Security headers working
- [ ] Performance metrics acceptable
- [ ] Log rotation configured
- [ ] Resource limits appropriate

## 🆘 Support

For issues and support:

1. Check the troubleshooting section
2. Review container logs
3. Verify configuration files
4. Test health endpoints
5. Check resource usage

## 📚 Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [Prometheus Monitoring](https://prometheus.io/docs/)
- [Grafana Dashboards](https://grafana.com/docs/)
