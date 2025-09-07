# Deployment Guide for Targets Navigator

This guide will help you deploy your Targets Navigator application to a VPS using GitHub Actions CI/CD.

## Prerequisites

- A VPS with Ubuntu/Debian
- Domain name (optional, but recommended)
- GitHub repository
- Supabase project (for your database)

## Quick Start

### 1. VPS Setup

SSH into your VPS and run the setup script:

```bash
# Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/elektrikmusik/targets-navigator/main/setup-vps.sh | bash

# Or clone the repository first
git clone https://github.com/elektrikmusik/targets-navigator.git
cd targets-navigator
chmod +x setup-vps.sh
./setup-vps.sh
```

### 2. Configure Environment Variables

Create a `.env.production` file on your VPS:

```bash
nano /opt/targets-navigator/.env.production
```

Add your production environment variables:

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
VITE_APP_ENV=production
```

### 3. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add:

- `VPS_HOST`: Your VPS IP address or domain
- `VPS_USERNAME`: Your VPS username (usually `root` or your user)
- `VPS_SSH_KEY`: Your private SSH key for accessing the VPS
- `VPS_PORT`: SSH port (usually 22)
- `VITE_SUPABASE_URL`: Your Supabase URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

### 4. Deploy

Push to the main branch to trigger automatic deployment:

```bash
git add .
git commit -m "Initial deployment setup"
git push origin main
```

## Manual Deployment

If you prefer manual deployment:

```bash
# On your VPS
cd /opt/targets-navigator
./deploy.sh
```

## SSL/HTTPS Setup (Optional)

### Using Let's Encrypt

1. Install Certbot:

```bash
sudo apt install certbot
```

2. Obtain SSL certificates:

```bash
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com
```

3. Copy certificates to your app:

```bash
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/*
```

4. Update `nginx.conf` to enable HTTPS (uncomment the HTTPS server block)

## Monitoring

Check application status:

```bash
./monitor.sh
```

View logs:

```bash
docker-compose -f docker-compose.prod.yml logs -f
```

## File Structure

```
.
├── .github/workflows/deploy.yml    # GitHub Actions workflow
├── docker-compose.prod.yml         # Production Docker Compose
├── nginx.conf                      # Nginx configuration
├── Dockerfile                      # Optimized Dockerfile
├── deploy.sh                       # Deployment script
├── setup-vps.sh                    # VPS setup script
├── monitor.sh                      # Monitoring script
└── env.production.example          # Environment variables template
```

## Troubleshooting

### Application not responding

1. Check if containers are running:

```bash
docker-compose -f docker-compose.prod.yml ps
```

2. Check logs:

```bash
docker-compose -f docker-compose.prod.yml logs
```

3. Restart the application:

```bash
docker-compose -f docker-compose.prod.yml restart
```

### Build failures

1. Check if all dependencies are installed:

```bash
npm ci --legacy-peer-deps
```

2. Clear Docker cache:

```bash
docker system prune -a
```

3. Rebuild from scratch:

```bash
docker-compose -f docker-compose.prod.yml build --no-cache
```

### GitHub Actions failures

1. Check if all secrets are properly configured
2. Verify SSH key has proper permissions
3. Check VPS connectivity

## Security Considerations

- The application runs as a non-root user
- Security headers are configured in Nginx
- SSL/TLS encryption is supported
- Docker containers are isolated
- Regular security updates are recommended

## Performance Optimization

- Gzip compression is enabled
- Static assets are cached for 1 year
- Docker multi-stage build reduces image size
- Nginx is optimized for serving static files

## Support

If you encounter any issues:

1. Check the logs using `./monitor.sh`
2. Verify all environment variables are set correctly
3. Ensure your VPS has sufficient resources
4. Check GitHub Actions logs for deployment issues

## Next Steps

- Set up monitoring and alerting
- Configure automated backups
- Set up log aggregation
- Implement blue-green deployments for zero-downtime updates
