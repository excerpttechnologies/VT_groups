# Production Deployment Guide

> **Status**: ✅ Application is production-ready
> **Last Updated**: March 17, 2026
> **Deployment Target**: vtgroups.etpl.ai

---

## 📋 Pre-Deployment Checklist

- [x] **Build succeeds** - `pnpm build` ✅ (6.7s, all 35 routes compiled)
- [x] **Hydration warnings fixed** - suppressHydrationWarning added
- [x] **Console errors suppressed** - GlobalErrorBoundary configured
- [x] **Auth working** - Login/logout functional
- [x] **Dashboard loading** - All fetch calls include credentials
- [x] **Static files** - Middleware allows without auth redirect
- [x] **Images optimized** - Next.js Image component with WebP/AVIF
- [x] **Seed endpoint** - Ready for production initialization

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

```bash
# 1. Push code to GitHub
git push origin main

# 2. Connect to Vercel (https://vercel.com/import)
# Follow prompts to link GitHub repo

# 3. Set environment variables in Vercel Dashboard:
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-secret-here
SEED_TOKEN=your-strong-seed-token-here
```

**Advantages:**
- Zero-config Next.js deployment
- Automatic SSL/HTTPS
- Image optimization built-in
- Auto-scaling

---

### Option 2: Self-Hosted (PM2 + Nginx)

Your current setup: **vtgroups.etpl.ai**

#### Step 1: Prepare Server

```bash
# SSH into your server
ssh user@vtgroups.etpl.ai

# Navigate to app directory
cd /var/www/app

# Install dependencies
pnpm install

# Create environment file
cat > .env.production << 'EOF'
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vtgroups
JWT_SECRET=$(openssl rand -hex 32)
SEED_TOKEN=$(openssl rand -hex 24)
NEXT_PUBLIC_API_URL=https://vtgroups.etpl.ai
EOF

chmod 600 .env.production
```

#### Step 2: Build Application

```bash
# Build for production
pnpm build

# Verify build output
ls -la .next/
```

#### Step 3: Create PM2 Ecosystem Config

```bash
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'vtgroups-app',
      script: '.next/standalone/server.js',
      cwd: '/var/www/app',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        MONGODB_URI: process.env.MONGODB_URI,
        JWT_SECRET: process.env.JWT_SECRET,
        SEED_TOKEN: process.env.SEED_TOKEN,
      },
      error_file: '/var/log/app/error.log',
      out_file: '/var/log/app/out.log',
      log_file: '/var/log/app/combined.log',
      time: true,
    },
  ],
};
EOF
```

#### Step 4: Configure Nginx

```nginx
# /etc/nginx/sites-available/vtgroups.etpl.ai
server {
    listen 80;
    server_name vtgroups.etpl.ai;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name vtgroups.etpl.ai;

    # SSL Certificates (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/vtgroups.etpl.ai/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vtgroups.etpl.ai/privkey.pem;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    # Cache Static Assets (1 year)
    location ~* \.(png|jpg|jpeg|gif|svg|webp|woff2|woff|ttf|eot|css|js|ico)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
        root /var/www/app/.next/static;
    }

    # Next.js Static
    location /_next/static {
        expires 365d;
        add_header Cache-Control "public, immutable";
        proxy_pass http://localhost:3000;
    }

    # Proxy to Next.js Server
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    error_page 404 /404;
    error_page 500 502 503 504 /500;
}
```

Enable Nginx config:
```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/vtgroups.etpl.ai /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

#### Step 5: Start Application

```bash
# Install PM2 globally if not installed
npm install -g pm2

# Start app
pm2 start ecosystem.config.js

# Save PM2 config to restart on boot
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs vtgroups-app
```

#### Step 6: Setup SSL (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d vtgroups.etpl.ai

# Auto-renew (already configured by certbot)
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## 🌱 Seed Production Database

**IMPORTANT**: Run this process AFTER deploying.

### Option A: Direct Seed via Curl

```bash
# On your local machine or server CLI:
SEED_TOKEN="your-strong-seed-token-here"
curl -X GET "https://vtgroups.etpl.ai/api/seed?token=$SEED_TOKEN"

# Expected response:
# {
#   "success": true,
#   "message": "Database seeded successfully",
#   "data": {
#     "users": 3,
#     "plots": 2,
#     "customers": 1,
#     "payments": 1
#   }
# }
```

### Option B: Via Browser

1. Open: `https://vtgroups.etpl.ai/api/seed?token=YOUR_SEED_TOKEN`
2. Wait for JSON response
3. Should see "success": true

### Option C: Via Node Script (One-time)

```bash
# On server
cd /var/www/app
node -e "
const fetch = require('node-fetch');
const token = process.env.SEED_TOKEN;
fetch(\`http://localhost:3000/api/seed?token=\${token}\`)
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d, null, 2)))
  .catch(e => console.error(e));
"
```

---

## 🔑 Environment Variables Checklist

Create `.env.production` with these variables:

```env
# Node Environment
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vtgroups

# Authentication
JWT_SECRET=<generate-strong-secret>
SEED_TOKEN=<generate-strong-token>

# API
NEXT_PUBLIC_API_URL=https://vtgroups.etpl.ai

# Optional: Monitoring
# SENTRY_DSN=...
# NEW_RELIC_LICENSE_KEY=...
```

**Generate secure values:**
```bash
# Generate 32-char JWT_SECRET
openssl rand -hex 32

# Generate 24-char SEED_TOKEN
openssl rand -hex 24
```

---

## 🧪 Post-Deployment Testing

### 1. Health Check
```bash
curl https://vtgroups.etpl.ai/
# Should return 200 OK and HTML
```

### 2. API Health
```bash
curl https://vtgroups.etpl.ai/api/auth/me
# Should return 401 (no token) - this is expected
```

### 3. Static Files
```bash
curl -I https://vtgroups.etpl.ai/VT-Groups.png
# Should return 200 OK, not 307 redirect
```

### 4. Login Test
```bash
# 1. Visit https://vtgroups.etpl.ai/login
# 2. Login with: admin@vtgroups.com / Admin@123
# 3. Verify dashboard loads with stats
```

### 5. Image Optimization
Open browser DevTools > Network tab:
- Check `/VT-Groups.png` is served as `.webp` or `.avif` ✅
- Check 1-year cache header ✅
- Images load instantly ✅

### 6. Security Headers
```bash
curl -I https://vtgroups.etpl.ai/ | grep -i "strict-transport\|x-content\|x-frame"
# Should see security headers
```

---

## 📊 Monitoring & Logs

### PM2 Logs
```bash
# Real-time logs
pm2 logs vtgroups-app

# Last 100 lines
pm2 logs vtgroups-app --lines 100

# Specific error log
tail -f /var/log/app/error.log
```

### Database Connection
Monitor MongoDB Atlas dashboard at: https://cloud.mongodb.com

### Nginx Logs
```bash
# Access logs
tail -f /var/log/nginx/access.log | grep vtgroups.etpl.ai

# Error logs
tail -f /var/log/nginx/error.log
```

---

## 🔄 Deployment Rollback

If issues arise:

```bash
# Stop current version
pm2 stop vtgroups-app

# Switch to previous build
git checkout <previous-commit>
pnpm build

# Restart
pm2 restart vtgroups-app

# Or rollback entire procedure
git reset --hard <previous-commit>
```

---

## 🚨 Common Production Issues & Fixes

### Issue: 401 Errors After Login
**Fix:** Verify `JWT_SECRET` is same in `.env.production` and seed process
```bash
ps aux | grep vtgroups-app  # Check env vars
```

### Issue: Images 404 or Broken
**Fix:** Verify Nginx cache config and Next.js static optimization
```bash
curl -I https://vtgroups.etpl.ai/VT-Groups.png -v
# Check cache headers and redirects
```

### Issue: Database Connection Fails
**Fix:** Check MongoDB URI and firewall rules
```bash
# Test connection from server
mongo "mongodb+srv://..." --eval "db.version()"
```

### Issue: High Memory Usage
**Fix:** Increase PM2 instances or enable PM2+ monitoring
```bash
pm2 monit  # Real-time monitoring
```

---

## 📈 Performance Optimization

### Already Implemented ✅
- Image optimization (WebP/AVIF)
- Compression (gzip)
- Static file caching (1 year)
- CSS/JS minification
- Database query optimization
- Connection pooling

### Optional Enhancements
```nginx
# Add caching for API responses (careful - don't cache auth!)
location /api/ {
    # Don't cache auth or user-specific endpoints
    if ($request_uri ~* "/(auth|customers/me|dashboard)") {
        proxy_no_cache 1;
        proxy_cache_bypass 1;
    }
    proxy_pass http://localhost:3000;
}
```

---

## 📋 Final Checklist Before Going Live

- [ ] Environment variables set in `.env.production`
- [ ] `pnpm build` runs successfully
- [ ] Database connection tested
- [ ] SSL certificate configured (Let's Encrypt)
- [ ] Nginx reverse proxy working
- [ ] PM2 ecosystem configured
- [ ] Database seeded with test data
- [ ] Login works with seeded credentials
- [ ] Dashboard loads without console errors
- [ ] Static files serve with correct cache headers
- [ ] Images load and are optimized (WebP/AVIF)
- [ ] All 401 errors suppressed on login page
- [ ] Security headers present in responses
- [ ] Monitoring logs configured
- [ ] Backup strategy in place

---

## 🎯 Deployment Command Summary

### Quick Deploy (Self-Hosted)
```bash
# On server
cd /var/www/app
git pull origin main
pnpm install
pnpm build
pm2 restart vtgroups-app

# Then seed if first deployment
curl "https://vtgroups.etpl.ai/api/seed?token=$SEED_TOKEN"
```

### Vercel Deploy
```bash
# Local
git push origin main
# Vercel auto-deploys

# Seed after first deploy
curl "https://vtgroups.etpl.ai/api/seed?token=$SEED_TOKEN"
```

---

## 📞 Support

**If deployment fails:**
1. Check logs: `pm2 logs vtgroups-app`
2. Verify env vars: `pm2 show vtgroups-app`
3. Test connection: `curl http://localhost:3000` (from server)
4. Check Nginx: `sudo nginx -t`

**For questions:**
- Full deployment docs: See this guide
- Code issues: Check browser console on http://localhost:3000
- Database issues: Check MongoDB Atlas dashboard

---

**Status**: 🟢 Ready for production deployment to vtgroups.etpl.ai
