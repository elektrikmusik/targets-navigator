# GitHub Actions Deployment Troubleshooting Guide

## 🚨 Common Deployment Failures & Solutions

### 1. **SSH Connection Issues**

**Error:** `Permission denied (publickey)` or `Connection refused`

**Solutions:**

```bash
# Test SSH connection manually
ssh -i /path/to/your/private/key root@your-vps-ip

# Check if SSH key is correct in GitHub secrets
# Go to: https://github.com/elektrikmusik/targets-navigator/settings/secrets/actions

# Regenerate SSH key if needed
ssh-keygen -t rsa -b 4096 -C "deployment@targets-navigator"
# Add public key to VPS: ~/.ssh/authorized_keys
```

### 2. **Git Pull Failures**

**Error:** `fatal: not a git repository` or `git pull failed`

**Solutions:**

```bash
# On VPS, check if directory exists and is a git repo
cd /opt/targets-navigator
ls -la
git status

# If not a git repo, clone it
cd /opt
rm -rf targets-navigator
git clone https://github.com/elektrikmusik/targets-navigator.git
cd targets-navigator
```

### 3. **Docker Build Failures**

**Error:** `Build failed` or `docker-compose build failed`

**Solutions:**

```bash
# Check Docker is running
docker --version
systemctl status docker

# Check disk space
df -h

# Clean Docker cache
docker system prune -a
docker volume prune -f

# Check Docker Compose file
cat docker-compose.prod.yml
```

### 4. **Application Won't Start**

**Error:** `Health check failed` or `Application not responding`

**Solutions:**

```bash
# Check container logs
docker-compose -f docker-compose.prod.yml logs

# Check if port 80 is available
netstat -tlnp | grep :80

# Check environment variables
cat .env.production

# Check Nginx configuration
docker-compose -f docker-compose.prod.yml exec targets-navigator nginx -t
```

### 5. **Missing Files**

**Error:** `docker-compose.prod.yml not found` or `.env.production not found`

**Solutions:**

```bash
# Check if files exist
ls -la /opt/targets-navigator/

# If missing, pull latest changes
cd /opt/targets-navigator
git pull origin main

# Or clone fresh
cd /opt
rm -rf targets-navigator
git clone https://github.com/elektrikmusik/targets-navigator.git
```

## 🔧 Debugging Commands

### Check GitHub Actions Logs

1. Go to: https://github.com/elektrikmusik/targets-navigator/actions
2. Click on the failed workflow run
3. Click on "Deploy to VPS" step
4. Look for error messages in the logs

### Check VPS Status

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Run the recovery script
cd /opt/targets-navigator
./recovery.sh

# Check specific issues
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs --tail=50
```

### Manual Deployment Test

```bash
# On VPS, test deployment manually
cd /opt/targets-navigator
./deploy.sh
```

## 🚀 Quick Fixes

### Restart Everything

```bash
cd /opt/targets-navigator
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

### Complete Rebuild

```bash
cd /opt/targets-navigator
docker-compose -f docker-compose.prod.yml down
docker system prune -a
docker-compose -f docker-compose.prod.yml up -d --build
```

### Reset to Clean State

```bash
cd /opt
rm -rf targets-navigator
git clone https://github.com/elektrikmusik/targets-navigator.git
cd targets-navigator
chmod +x *.sh
./deploy.sh
```

## 📊 Monitoring Commands

### Check Application Health

```bash
# Quick health check
curl -I http://localhost

# Detailed status
./monitor.sh

# Real-time logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Check System Resources

```bash
# Disk space
df -h

# Memory usage
free -h

# Docker resources
docker system df
```

## 🔍 Error Code Reference

| Error Code | Meaning                | Solution                          |
| ---------- | ---------------------- | --------------------------------- |
| 1          | General error          | Check logs for specific error     |
| 2          | SSH connection failed  | Check SSH key and VPS access      |
| 3          | Git pull failed        | Check repository access           |
| 4          | Docker build failed    | Check Dockerfile and dependencies |
| 5          | Container start failed | Check logs and configuration      |
| 6          | Health check failed    | Check application logs            |

## 🆘 Emergency Recovery

If everything is broken:

```bash
# 1. Stop everything
docker-compose -f docker-compose.prod.yml down
docker system prune -a

# 2. Fresh start
cd /opt
rm -rf targets-navigator
git clone https://github.com/elektrikmusik/targets-navigator.git
cd targets-navigator

# 3. Setup environment
cp env.production.example .env.production
# Edit .env.production with your values

# 4. Deploy
chmod +x *.sh
./deploy.sh
```

## 📞 Getting Help

1. **Check GitHub Actions logs** first
2. **Run recovery script** on VPS
3. **Check this troubleshooting guide**
4. **Verify all secrets** are set correctly
5. **Test manual deployment** to isolate the issue

## 🔄 Workflow Improvements

The improved workflow (`.github/workflows/deploy-improved.yml`) includes:

- Better error handling with `set -e`
- Detailed logging with emojis
- Health check retries
- File existence checks
- Graceful error recovery
- Timeout protection
- Status notifications

To use the improved workflow:

```bash
# Replace the current workflow
mv .github/workflows/deploy-improved.yml .github/workflows/deploy.yml
git add .github/workflows/deploy.yml
git commit -m "Improve deployment workflow with better error handling"
git push origin main
```
