#!/bin/bash

# VPS SSH Setup Script
# This script configures SSH key authentication on the VPS

set -e

VPS_HOST="69.62.124.140"
VPS_USER="root"

echo "🔧 Setting up SSH key authentication on VPS..."
echo "=============================================="

# Connect to VPS and configure SSH
ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_HOST << 'EOF'
    echo "🔑 Configuring SSH key authentication..."
    
    # Set proper permissions for SSH keys
    chmod 700 ~/.ssh
    chmod 600 ~/.ssh/vps_key
    chmod 644 ~/.ssh/vps_key.pub
    
    # Add public key to authorized_keys
    cat ~/.ssh/vps_key.pub >> ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
    
    # Remove duplicate entries from authorized_keys
    sort ~/.ssh/authorized_keys | uniq > ~/.ssh/authorized_keys.tmp
    mv ~/.ssh/authorized_keys.tmp ~/.ssh/authorized_keys
    
    # Configure SSH daemon for key authentication
    echo "🔧 Configuring SSH daemon..."
    
    # Backup original sshd_config
    cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
    
    # Update SSH configuration
    cat >> /etc/ssh/sshd_config << 'SSHD_EOF'

# GitHub Actions SSH Configuration
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
PasswordAuthentication yes
PermitRootLogin yes
StrictModes yes
MaxAuthTries 3
ClientAliveInterval 60
ClientAliveCountMax 3
SSHD_EOF

    # Restart SSH service
    systemctl restart sshd
    
    echo "✅ SSH key authentication configured successfully!"
    echo "📋 Testing SSH key connection..."
    
    # Test the connection
    if ssh -o StrictHostKeyChecking=no -i ~/.ssh/vps_key localhost "echo 'SSH key test successful'"; then
        echo "✅ SSH key authentication is working!"
    else
        echo "❌ SSH key authentication test failed"
        exit 1
    fi
    
    echo "🎉 VPS SSH setup completed successfully!"
EOF

echo ""
echo "✅ VPS SSH configuration completed!"
echo ""
echo "📋 Next steps:"
echo "1. Update your GitHub VPS_SSH_KEY secret with the private key"
echo "2. Test the deployment again"
echo ""
echo "🔑 Private key for GitHub secret:"
echo "================================="
cat ~/.ssh/vps_key
