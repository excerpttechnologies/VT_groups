# Production Deployment Guide

## Overview
This guide fixes authentication issues when deploying to production (VPS). Follow all steps carefully.

---

## ⚠️ CRITICAL ISSUES FOUND & FIXED

### 1. **Environment Variables Bug**
**Problem:** `NEXT_PUBLIC_API_URL=http://localhost:3000/api` (includes `/api` twice)
- ❌ Wrong: Frontend calls `/api/api/auth/login` 
- ✅ Fixed: `NEXT_PUBLIC_API_URL=http://localhost:3000` (no `/api`)

### 2. **JWT_SECRET Not Set in Production**
**Problem:** Falls back to `'fallback_secret_for_dev_only'` if not set
- ⚠️ Tokens generated with one secret won't validate if backend restarts with different loaded secret
- ❌ Multiple servers/replicas will have different secrets → tokens fail

### 3. **Cookie sameSite='lax' Issues**
**Problem:** Won't work if frontend and backend are on different domains
- ❌ Cookies won't send to different domain with `sameSite='lax'`
- ⚠️ Needs `sameSite='none'` + `secure=true` for cross-domain

### 4. **Missing HTTPS/SSL**
**Problem:** `secure: process.env.NODE_ENV === 'production'` requires HTTPS
- ❌ If NGINX doesn't use HTTPS, cookies won't be sent

---

## Step 1: Prepare Environment Variables

### 1a. Generate Secrets (Run on your local machine)
```bash
# Generate JWT_SECRET (32+ chars)
openssl rand -base64 32

# Generate SEED_TOKEN  
openssl rand -base64 32
```

### 1b. Create .env.production on VPS
```bash
# On VPS
cd /home/app/land-management  # your app directory
nano .env.production
```

**Paste this and update with YOUR values:**
```env
# DATABASE
MONGODB_URI=mongodb+srv://YOUR_DB_USER:YOUR_DB_PASSWORD@cluster.mongodb.net/land_management

# JWT - Use output from `openssl rand -base64 32`
JWT_SECRET=YOUR_GENERATED_SECRET_HERE_MUST_BE_32_CHARS

# APP
NEXT_PUBLIC_API_URL=https://yourdomain.com
NODE_ENV=production
JWT_EXPIRES_IN=7d

# SECURITY
ALLOW_ADMIN_REGISTER=false
SEED_TOKEN=YOUR_GENERATED_SEED_TOKEN

# EMAIL (optional, for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=app-specific-password
```

**Critical Checklist:**
- [ ] JWT_SECRET is 32+ characters, random, unique
- [ ] MONGODB_URI points to correct database
- [ ] VPS IP is whitelisted in MongoDB Atlas (Network Access)
- [ ] NEXT_PUBLIC_API_URL is your production domain (no `/api`)
- [ ] NODE_ENV=production
- [ ] File saved without accidental spaces

---

## Step 2: Verify MongoDB Connection

### 2a. Test from VPS
```bash
# Install mongosh if not present
npm install -g mongosh

# Test connection
mongosh "mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster.mongodb.net/land_management"

# If successful, you'll get MongoDB shell
# Check if your user exists:
db.users.find().limit(1)

# Exit
exit
```

**Common Issues:**
- ❌ `connection refused`: VPS IP not whitelisted → Add to MongoDB Atlas Security
- ❌ `authentication failed`: Wrong username/password
- ❌ `hostname resolution failed`: Wrong cluster URL

### 2b. Whitelist VPS IP in MongoDB Atlas
1. Go to mongodb.com → manage.mongodb.com
2. Select your Cluster
3. Network Access → Add IP Address
4. Enter your VPS public IP (or 0.0.0.0/0 for allow-all, less secure)
5. Save and wait 5 minutes for propagation

---

## Step 3: Build & Deploy Application

### 3a. Install Dependencies
```bash
cd /home/app/land-management
pnpm install  # or npm install
```

### 3b. Build Application
```bash
# With .env.production loaded
NEXT_TELEMETRY_DISABLED=1 pnpm run build
```

**Check for errors:**
- ❌ "Module not found" → Missing dependency, run `pnpm install` again
- ✅ Next.js build successful → ✓ Ready to run

### 3c. Test Locally (Before Running)
```bash
# Start application in production mode
NODE_ENV=production pnpm start
```

**What to see:**
```
▲ Next.js 14.0.0
  - ready on 0.0.0.0:3000
```

**Test login (optional):**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vtgroups.com","password":"Admin@123"}'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "...", "email": "...", "role": "admin", "name": "..." },
    "mustChangePassword": false,
    "lastLoginAt": "2025-03-23T..."
  }
}
```

**If login fails:**
- Check logs: `tail -100 /var/log/your-app/app.log`
- Look for `[LOGIN-xxx]` prefixed logs with detailed errors
- See Debugging section below

---

## Step 4: Setup NGINX Reverse Proxy

### 4a. Install NGINX
```bash
sudo apt update
sudo apt install nginx
```

### 4b. Create NGINX Config
```bash
sudo nano /etc/nginx/sites-available/land-management
```

**Paste this config:**
```nginx
# ============================================================================
# NGINX Configuration for Next.js Land Management Application
# ============================================================================

# Upstream: Where Next.js is running
upstream nextjs_backend {
    least_conn;  # Load balancing strategy
    server 127.0.0.1:3000 max_fails=3 fail_timeout=30s;
}

# HTTP → HTTPS Redirect
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        return 301 https://$server_name$request_uri;
    }

    # Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
    }
}

# HTTPS: Main application
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Certificates (from Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL Security Headers
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    error_log /var/log/nginx/land-management-error.log;
    access_log /var/log/nginx/land-management-access.log combined;

    # Client upload size
    client_max_body_size 50M;

    # Root for static files
    root /home/app/land-management/.next/static;

    # Proxy configuration
    location / {
        # Forward to Next.js
        proxy_pass http://nextjs_backend;
        proxy_http_version 1.1;

        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;

        # Websocket support (if needed)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Disable buffering for streaming
        proxy_buffering off;
    }

    # Serve static files directly (skip Next.js)
    location /_next/static {
        alias /home/app/land-management/.next/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check endpoint (optional)
    location /health {
        return 200 "OK";
        add_header Content-Type text/plain;
    }
}
```

### 4c. Enable NGINX Config
```bash
# Symlink to sites-enabled
sudo ln -s /etc/nginx/sites-available/land-management /etc/nginx/sites-enabled/

# Test config syntax
sudo nginx -t
# Should output: nginx: configuration file test is successful

# Restart NGINX
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx
```

---

## Step 5: Setup SSL Certificate (HTTPS)

### 5a. Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx
```

### 5b. Get Free SSL Certificate
```bash
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
```

**Follow prompts:**
- Enter email
- Agree to ToS
- Enter domain names

**If successful:**
```
Congratulations! Your certificate and chain have been saved.
Certificate: /etc/letsencrypt/live/yourdomain.com/fullchain.pem
Key: /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

### 5c. Auto-Renew Certificate
```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Verify
sudo systemctl status certbot.timer
```

---

## Step 6: Process Manager (PM2)

### 6a. Install PM2
```bash
sudo npm install -g pm2
```

### 6b. Create PM2 Config
```bash
nano /home/app/land-management/ecosystem.config.js
```

**Paste:**
```javascript
module.exports = {
  apps: [{
    name: 'land-management',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/home/app/land-management',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    instances: 'max',
    exec_mode: 'cluster',
    error_file: '/var/log/pm2/land-management-error.log',
    out_file: '/var/log/pm2/land-management-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    autorestart: true,
    watch: false,
    ignore_watch: ['node_modules', '.next', '.git'],
    max_memory_restart: '500M',
  }],
};
```

### 6c. Start Application
```bash
# Change to app directory
cd /home/app/land-management

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 config
pm2 save

# Setup startup hooks (auto-start on server reboot)
pm2 startup
# Copy and run the output command

# Monitor
pm2 monit
pm2 logs land-management
```

**Check if running:**
```bash
pm2 status
# Should show "online" for land-management
```

---

## Step 7: Verify Everything Works

### 7a. Test Frontend Access
```bash
curl -I https://yourdomain.com
# Should return: HTTP/1.1 200 OK
```

### 7b. Test Login Endpoint
```bash
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vtgroups.com",
    "password": "Admin@123"
  }' \
  -v  # -v shows headers including cookies
```

**Expected:**
```
< HTTP/2 200
< set-cookie: token=eyJhbGciOiJIUzI1NiI...
```

**If you see `401 Unauthorized`:**
- Check logs: `pm2 logs land-management`
- Look for `[LOGIN-xxx]` messages
- Search for `❌` symbols in logs
- See Debugging section

### 7c. Test with Browser
```
1. Open https://yourdomain.com in browser
2. Click Login
3. Enter: admin@vtgroups.com / Admin@123
4. Should redirect to /admin dashboard
```

---

## Debugging Checklist

### Login Returns 401 Unauthorized
```bash
# Check logs for detailed error
pm2 logs land-management | grep "LOGIN"

# Look for these messages:
# ❌ JWT_SECRET not set → Set in .env.production
# ❌ MongoDB connection failed → Check MONGODB_URI, VPS IP whitelist
# ❌ User not found → Check if user exists in DB: mongosh ...
# ❌ Password mismatch → Wrong credentials
# ❌ Account is deactivated → Set isActive: true in DB
```

### Cookies Not Being Set
```bash
# Check if HTTPS is actually active
curl -I https://yourdomain.com
# Should show: HTTP/2 (not HTTP/1.1)

# Check NGINX config
sudo nginx -t

# Check if backend is receiving HTTPS via proxy
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vtgroups.com","password":"Admin@123"}' \
  -v

# Look for: "set-cookie: token=..."
```

### Frontend Can't Call API
```bash
# Check NEXT_PUBLIC_API_URL in .env.production
cat .env.production | grep NEXT_PUBLIC_API_URL

# Should be: https://yourdomain.com (no /api)
# NOT: https://yourdomain.com/api

# Rebuild if changed
pnpm run build
pm2 restart land-management
```

### Database Connection Error
```bash
# Test from VPS
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/land_management"

# If fails:
# 1. Check username/password in MONGODB_URI
# 2. Add VPS IP to MongoDB Atlas Network Access
# 3. Wait 5+ minutes for propagation
```

### JWT Token Mismatch Error
```bash
# Symptoms: Login successful but subsequent API calls return 401

# Cause: JWT_SECRET mismatch between servers/restarts

# Check JWT_SECRET is set and identical
grep JWT_SECRET .env.production

# Ensure it's set (not using fallback)
pm2 logs land-management | grep "JWT_SECRET"

# Restart to apply
pm2 restart land-management
```

---

## Common Issues & Solutions

### Issue: "secure: true but not HTTPS"
**Symptom:** Cookies not being sent
**Solution:**
1. Verify NGINX uses HTTPS: `sudo nginx -t`
2. Verify SSL cert exists: `ls /etc/letsencrypt/live/yourdomain.com/`
3. Check proxy headers in NGINX:
   ```
   proxy_set_header X-Forwarded-Proto $scheme;
   ```
4. Restart: `sudo systemctl restart nginx && pm2 restart land-management`

### Issue: "CORS blocked by browser"
**Symptom:** Frontend GET/POST calls show CORS errors
**Solution:** This app uses same-origin cookies, not CORS
- If frontend and backend are on same domain: should work
- If different domains: need CORS config (not covered here)

### Issue: "Too many login attempts"
**Symptom:** Legitimate login fails after trying multiple times
**Solution:** No rate limiting in current code, but check:
- Is user account suspended? (isActive: false)
- Is password correct?
- Check logs for details

### Issue: "Token expired"
**Symptom:** Login works but dashboard shows "Session expired" after a while
**Solution:**
- JWT expires after `JWT_EXPIRES_IN` (default: 7 days)
- Cookies expire after `maxAge: 7 days`
- Frontend should refresh token or prompt re-login

---

## Production Checklist

- [ ] `.env.production` created with all required variables
- [ ] JWT_SECRET is unique, 32+ chars, and NOT the dev fallback
- [ ] MONGODB_URI is correct and VPS IP whitelisted
- [ ] NEXT_PUBLIC_API_URL is correct (no `/api` suffix)
- [ ] Application builds without errors: `pnpm run build`
- [ ] NGINX installed, configured, and restarted
- [ ] SSL certificate installed and auto-renewal enabled
- [ ] PM2 started application successfully
- [ ] Login test passed with curl/browser
- [ ] Check logs for any `❌` or error messages
- [ ] Set up monitoring/alerting for errors

---

## Monitoring & Maintenance

### View Logs
```bash
# Real-time logs
pm2 logs land-management

# Last 100 lines
pm2 logs land-management --lines 100

# Error logs only
pm2 logs land-management --err

# NGINX logs
sudo tail -f /var/log/nginx/land-management-error.log
```

### Restart Application
```bash
# Restart
pm2 restart land-management

# Reboot safe (waits for requests to complete)
pm2 reload land-management
```

### Database Backups
```bash
# MongoDB Atlas: Automatic daily backups included
# Check in: mongodb.com → manage → Backup

# Manual backup (if self-hosted):
# mongodump --uri="mongodb+srv://..." --out=/path/to/backup
```

---

## For Further Help

1. **Check Enhanced Login Logs:**
   - Login route now includes `[LOGIN-xxx]` prefixed debug messages
   - Shows each step: DB connection, user lookup, password check, JWT generation, cookie setting
   - Look for `❌` symbols to identify exact failure point

2. **Review Error Messages:**
   - Each step logs what's happening
   - Check `pm2 logs` for detailed, timestamped events

3. **Verify Configuration:**
   - All env vars set: `env | grep -E "MONGODB|JWT|NODE_ENV|NEXT_PUBLIC"`
   - Config syntax: `sudo nginx -t` for NGINX

---

**That's it! Your application should now be fully functional in production with proper authentication.**

