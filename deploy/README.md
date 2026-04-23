# Deployment Guide — AWS Lightsail

## First Time Setup

1. SSH into your Lightsail instance
2. Run the setup script:
   ```bash
   bash deploy/setup-lightsail.sh
   ```
3. Deploy for the first time:
   ```bash
   REPO_URL=https://github.com/YOUR_USERNAME/YOUR_REPO.git bash deploy/first-deploy.sh
   ```
4. Edit production environment variables:
   ```bash
   nano .env
   ```
   Required variables:
   - `DATABASE_URL` — absolute path to SQLite file, e.g. `file:/home/ubuntu/ssg-pharma/data/prod.db`
   - `NEXT_PUBLIC_SITE_URL` — your domain, e.g. `https://yourdomain.com`
   - `ADMIN_SESSION_SECRET` — random 32+ char string
   - `NODE_ENV=production`

5. Restart the app after editing .env:
   ```bash
   pm2 restart nextapp
   ```

## Every Subsequent Deploy

Push to GitHub, then on the server:
```bash
cd /home/ubuntu/ssg-pharma && bash deploy/deploy.sh
```

## After Deploy Health Check
```bash
APP_URL=https://yourdomain.com bash deploy/check-health.sh
```

## If CSS/JS Breaks After Build
```bash
cd /home/ubuntu/ssg-pharma && node scripts/standalone-setup.mjs && pm2 restart nextapp
```

## Reset Admin Password
```bash
cd /home/ubuntu/ssg-pharma && bash deploy/reset-admin-password.sh
```

## Logs
```bash
pm2 logs nextapp
pm2 logs nextapp --lines 100
```

## Port
The app runs on port 3000 internally. Point your Lightsail firewall and any reverse proxy (nginx/caddy) to port 3000.
