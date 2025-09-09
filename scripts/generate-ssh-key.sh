#!/bin/bash

# SSH Key Generation Script for GitHub Actions Deployment
# This script generates a proper SSH key pair for VPS deployment

set -e

echo "🔑 SSH Key Generation Script for GitHub Actions"
echo "=============================================="

# Check if key already exists
if [ -f ~/.ssh/vps_key ]; then
    echo "⚠️  SSH key already exists at ~/.ssh/vps_key"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Aborted. Using existing key."
        exit 0
    fi
fi

# Generate SSH key pair
echo "🔨 Generating new SSH key pair..."
ssh-keygen -t ed25519 -C "github-actions@$(hostname)" -f ~/.ssh/vps_key -N ""

echo ""
echo "✅ SSH key pair generated successfully!"
echo ""

# Display the keys
echo "📋 PRIVATE KEY (for VPS_SSH_KEY secret in GitHub):"
echo "=================================================="
echo "Copy this entire block and paste it as VPS_SSH_KEY in GitHub repository secrets:"
echo ""
cat ~/.ssh/vps_key
echo ""
echo "=================================================="
echo ""

echo "📋 PUBLIC KEY (for VPS authorized_keys):"
echo "========================================"
echo "Copy this and add it to your VPS ~/.ssh/authorized_keys file:"
echo ""
cat ~/.ssh/vps_key.pub
echo ""
echo "========================================"
echo ""

echo "📝 Next steps:"
echo "1. Copy the PRIVATE KEY above and add it as VPS_SSH_KEY in GitHub repository settings"
echo "2. Copy the PUBLIC KEY above and add it to your VPS: ~/.ssh/authorized_keys"
echo "3. Ensure your VPS has the correct permissions:"
echo "   - chmod 700 ~/.ssh"
echo "   - chmod 600 ~/.ssh/authorized_keys"
echo "4. Test the connection: ssh -i ~/.ssh/vps_key username@your-vps-host"
echo ""

echo "🎉 SSH key setup complete!"
