#!/bin/bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/app}"
APP_DATA_DIR="${APP_DATA_DIR:-$APP_DIR/data}"

echo "=== Lightsail Initial Setup ==="
echo "Ensure Lightsail networking allows inbound ports: 22, 80, 443."
echo "Ensure DNS A records for ssgpharma.com and www.ssgpharma.com point to this instance static IP."

echo "=== Updating system packages ==="
sudo apt-get update -y
sudo apt-get upgrade -y

echo "=== Installing base dependencies ==="
sudo apt-get install -y git curl nginx certbot python3-certbot-nginx

echo "=== Installing Node.js 20 LTS ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "=== Installing pnpm and PM2 ==="
if command -v pnpm >/dev/null 2>&1; then
  echo "pnpm already installed at $(command -v pnpm); skipping install."
else
  sudo npm install -g pnpm
fi

if command -v pm2 >/dev/null 2>&1; then
  echo "pm2 already installed at $(command -v pm2); skipping install."
else
  sudo npm install -g pm2
fi

echo "=== Creating app directories ==="
sudo mkdir -p "$APP_DIR" "$APP_DATA_DIR"
sudo chown -R "$USER:$USER" "$APP_DIR"

echo "=== Enabling Nginx ==="
sudo systemctl enable nginx
sudo systemctl start nginx

echo "=== Configuring PM2 startup ==="
pm2 startup systemd -u "$USER" --hp "$HOME" || true
sudo env PATH="$PATH" pm2 startup systemd -u "$USER" --hp "$HOME" || true
pm2 save || true

echo "=== Setup complete ==="
echo "Next step: run deploy/bootstrap.sh (preferred) or deploy/first-deploy.sh."
