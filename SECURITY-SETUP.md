# 🔐 Security Setup Guide

This guide explains how to properly configure secrets and environment variables for the targets-navigator project.

## 🚨 Critical Security Notice

**NEVER commit secrets to version control!** All sensitive information must be stored in GitHub Secrets or environment variables.

## 📋 Required GitHub Secrets

### 1. Supabase Configuration

- **Secret Name**: `VITE_SUPABASE_URL`
- **Value**: Your Supabase project URL
- **Example**: `https://your-project-id.supabase.co`

- **Secret Name**: `VITE_SUPABASE_ANON_KEY`
- **Value**: Your Supabase anonymous key
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2. VPS Deployment Configuration

- **Secret Name**: `VPS_HOST`
- **Value**: Your VPS server IP address or domain
- **Example**: `192.168.1.100` or `your-server.com`

- **Secret Name**: `VPS_USERNAME`
- **Value**: SSH username for VPS access
- **Example**: `root` or `deploy`

- **Secret Name**: `VPS_SSH_KEY`
- **Value**: Private SSH key for VPS access
- **Example**: `-----BEGIN OPENSSH PRIVATE KEY-----...`

- **Secret Name**: `VPS_PORT` (Optional)
- **Value**: SSH port number
- **Default**: `22`

### 3. Monitoring Configuration (Optional)

- **Secret Name**: `GRAFANA_ADMIN_PASSWORD`
- **Value**: Strong password for Grafana admin
- **Example**: `YourSecurePassword123!`

## 🛠️ How to Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter the secret name and value
5. Click **Add secret**

## 🔧 Local Development Setup

### 1. Create Environment File

```bash
# Copy the template
cp env.production.template .env.local

# Edit with your values
nano .env.local
```

### 2. Environment File Structure

```bash
# .env.local
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_APP_ENV=development
```

## 🐳 Docker Production Setup

### 1. Create Production Environment File

```bash
# On your VPS server
cp env.production.template .env.production
nano .env.production
```

### 2. Set Required Environment Variables

```bash
# .env.production
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
VITE_APP_ENV=production
GRAFANA_ADMIN_PASSWORD=your_secure_grafana_password
```

## 🔍 Security Checklist

- [ ] All secrets removed from version control
- [ ] GitHub Secrets configured
- [ ] Environment files added to .gitignore
- [ ] Strong passwords used for all services
- [ ] SSH keys properly secured
- [ ] Regular secret rotation scheduled
- [ ] Access logs monitored
- [ ] Security scanning enabled in CI/CD

## 🚨 Emergency Response

If secrets are accidentally committed:

1. **Immediately rotate all exposed secrets**
2. **Remove secrets from git history**
3. **Update all systems with new secrets**
4. **Review access logs for unauthorized usage**

## 📞 Support

For security-related questions or issues, contact the development team immediately.

---

**Remember**: Security is everyone's responsibility. When in doubt, ask for help!
