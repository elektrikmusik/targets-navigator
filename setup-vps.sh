#!/bin/bash

# VPS Setup Script for Targets Navigator
# Run this script on your VPS to prepare the environment

echo "Setting up VPS for Targets Navigator deployment..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo apt install git -y

# Install curl for health checks
sudo apt install curl -y

# Create application directory
mkdir -p /opt/targets-navigator
cd /opt/targets-navigator

# Clone your repository (replace with your actual repository URL)
echo "Please clone your repository manually:"
echo "git clone https://github.com/elektrikmusik/targets-navigator.git ."
echo ""
echo "Or if you want to clone it now, please provide your repository URL:"
read -p "Repository URL: " REPO_URL
if [ ! -z "$REPO_URL" ]; then
    git clone $REPO_URL .
fi

# Make scripts executable
chmod +x deploy.sh

# Create SSL directory
mkdir -p ssl

# Create environment file template
cat > .env.production << EOF
# Production Environment Variables
VITE_SUPABASE_URL=https://dnlnfohcjvoqwuufpyyo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRubG5mb2hjanZvcXd1dWZweXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MzAyODYsImV4cCI6MjA2NDQwNjI4Nn0.7AbPWVNDHRojxa8M7R2tTUXHwOSYn3bUYZezDHhNgcA
VITE_APP_ENV=production
EOF

echo "VPS setup completed!"
echo ""
echo "Next steps:"
echo "1. Update .env.production with your actual environment variables"
echo "2. Configure your domain DNS to point to this VPS"
echo "3. (Optional) Obtain SSL certificates: sudo certbot certonly --standalone -d your-domain.com"
echo "4. (Optional) Update nginx.conf with your domain name and SSL configuration"
echo "5. Set up GitHub secrets for automated deployment:"
echo "   - VPS_HOST: $(curl -s ifconfig.me)"
echo "   - VPS_USERNAME: $USER"
echo "   - VPS_SSH_KEY: (your private SSH key)"
echo "   - VITE_SUPABASE_URL: (your Supabase URL)"
echo "   - VITE_SUPABASE_ANON_KEY: (your Supabase anon key)"
echo "6. Run ./deploy.sh to deploy your application"
