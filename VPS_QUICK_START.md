# VPS Deployment Quick Start

**TL;DR for deploying authentication-fixed app to VPS**

---

## What Was Fixed

| Issue | Fix |
|-------|-----|
| ❌ `NEXT_PUBLIC_API_URL=http://localhost:3000/api` | ✅ Changed to `http://localhost:3000` |
| ❌ JWT_SECRET falls back to dev value | ✅ Added production validation + .env.production template |
| ❌ Minimal error logging | ✅ Added 13-step detailed login logging with request IDs |
| ❌ No deployment guide | ✅ Complete PRODUCTION_DEPLOYMENT_GUIDE.md created |
| ❌ No NGINX config | ✅ Production-ready NGINX_CONFIG.conf created |
| ❌ Hard to debug | ✅ AUTH_DEBUGGING_CHECKLIST.md created |

---

## 5-Minute VPS Setup

### 1. Prepare Local Machine
```bash
# Generate secrets
JWT_SECRET=$(openssl rand -base64 32)
SEED_TOKEN=$(openssl rand -base64 32)

echo "JWT_SECRET: $JWT_SECRET"
echo "SEED_TOKEN: $SEED_TOKEN"
# Copy these - you'll need them
```

### 2. On VPS: Create .env.production
```bash
cd /path/to/app
nano .env.production
```

**Paste and customize:**
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/land_management
JWT_SECRET=[paste your generated JWT_SECRET]
NEXT_PUBLIC_API_URL=https://yourdomain.com
NODE_ENV=production
JWT_EXPIRES_IN=7d
ALLOW_ADMIN_REGISTER=false
SEED_TOKEN=[paste your generated SEED_TOKEN]
```

### 3. Build Application
```bash
pnpm install
NODE_ENV=production pnpm run build
```

### 4. Start with PM2
```bash
pm2 start "npm start" --name land-management -- --port 3000
pm2 save
pm2 startup
```

### 5. Setup NGINX
```bash
sudo tee /etc/nginx/sites-available/land-management > /dev/null << 'EOF'
upstream nextjs {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    add_header Strict-Transport-Security "max-age=31536000" always;

    location / {
        proxy_pass http://nextjs;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/land-management /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
```

### 6. Setup SSL
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
sudo systemctl enable certbot.timer
```

### 7. Test Login
```bash
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vtgroups.com",
    "password": "Admin@123"
  }' \
  -v

# Look for: set-cookie: token=...
# Status: HTTP/2 200
```

---

## Verify Everything Works

```bash
# 1. Check app running
pm2 status
# Should show: online

# 2. Check NGINX
sudo systemctl status nginx
# Should show: active

# 3. Check logs for any [LOGIN-xxx] ❌ errors
pm2 logs land-management --lines 50

# 4. Test in browser
# Open https://yourdomain.com → Login → Dashboard
```

---

## If Login Fails

1. **Check logs:**
   ```bash
   pm2 logs land-management | grep "LOGIN"
   ```
   
2. **Look for `❌` symbols** - they show exactly what failed
   
3. **Common fixes:**
   ```bash
   # Missing JWT_SECRET
   grep JWT_SECRET .env.production
   # Should show your secret, not blank
   
   # Database not accessible
   mongosh "mongodb+srv://..." 
   # Should connect
   
   # HTTPS not working
   curl -I https://yourdomain.com
   # Should show HTTP/2
   ```

4. **Read detailed troubleshooting:**
   → `AUTH_DEBUGGING_CHECKLIST.md`

---

## Files to Review

| File | Purpose |
|------|---------|
| **AUTHENTICATION_FIX_SUMMARY.md** | What was fixed and why |
| **PRODUCTION_DEPLOYMENT_GUIDE.md** | Complete step-by-step deployment |
| **AUTH_DEBUGGING_CHECKLIST.md** | Troubleshooting guide |
| **NGINX_CONFIG.conf** | Copy to `/etc/nginx/sites-available/` |
| **.env.production** | Template for environment variables |

---

## Environment Variables (All Required)

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
JWT_SECRET=min_32_chars_random_secret_from_openssl_rand
NEXT_PUBLIC_API_URL=https://yourdomain.com          # No /api
NODE_ENV=production
JWT_EXPIRES_IN=7d
ALLOW_ADMIN_REGISTER=false
SEED_TOKEN=random_seed_token
```

---

## Pre-Deployment Checklist

- [ ] Generated JWT_SECRET with `openssl rand -base64 32`
- [ ] MongoDB Atlas whitelisted VPS IP
- [ ] `.env.production` created with all values
- [ ] Built successfully: `pnpm run build`
- [ ] Domain DNS points to VPS IP
- [ ] VPS has ports 80, 443 open

---

## Post-Deployment Verification

- [ ] Domain loads with HTTPS (no SSL errors)
- [ ] Login API returns token (`curl -X POST...`)
- [ ] Browser login works (can reach dashboard)
- [ ] No `❌` symbols in `pm2 logs`
- [ ] SSL auto-renews (check certbot)

---

**That's it! Your authentication system is now production-ready.**

For detailed info, see **PRODUCTION_DEPLOYMENT_GUIDE.md**
For troubleshooting, see **AUTH_DEBUGGING_CHECKLIST.md**
