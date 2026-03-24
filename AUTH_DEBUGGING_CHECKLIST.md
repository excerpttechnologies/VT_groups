# Authentication Debugging Checklist

Quick reference to diagnose and fix auth issues. Run through these checks systematically.

---

## 🔍 Step 1: Verify Environment Variables

### Check if .env.production exists and is loaded
```bash
# On VPS, in app directory
ls -la .env.production

# Check if variables are set (should not show fallback in production)
pm2 logs land-management | grep "JWT_SECRET\|NODE_ENV\|MONGODB_URI"
```

### ✅ Checklist
- [ ] `.env.production` file exists
- [ ] `JWT_SECRET` is set (not using fallback_secret_for_dev_only)
- [ ] `MONGODB_URI` is correct
- [ ] `NODE_ENV=production`
- [ ] `NEXT_PUBLIC_API_URL=https://yourdomain.com` (NO /api)

---

## 🔌 Step 2: Verify Database Connection

### Test MongoDB Connection
```bash
# Install mongosh if needed
npm install -g mongosh

# Test connection
mongosh "mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster.mongodb.net/land_management"

# In mongosh, run:
db.users.find().limit(1)
exit
```

### ✅ Checklist
- [ ] mongosh connects without error
- [ ] Can query users collection
- [ ] Test user exists in DB (check with find())
- [ ] VPS IP is whitelisted in MongoDB Atlas Network Access

**If mongosh fails:**
```
❌ "connection refused" → VPS IP not whitelisted in MongoDB Atlas
❌ "authentication failed" → Wrong username/password in MONGODB_URI
❌ "hostname resolution failed" → Wrong cluster URL
```

---

## 🌐 Step 3: Verify HTTPS/SSL

### Check NGINX is using HTTPS
```bash
# Test NGINX config
sudo nginx -t
# Should say: nginx: configuration file test is successful

# Check if listening on 443
sudo netstat -tulnp | grep nginx
# Should show: LISTEN ... :443

# Check SSL certificates exist
ls -la /etc/letsencrypt/live/yourdomain.com/
```

### Test HTTPS connection
```bash
# Should return 200 with HTTPS
curl -I https://yourdomain.com

# Should show HTTP/2 if HTTPS working
curl -I https://yourdomain.com | grep -i "HTTP"
```

### ✅ Checklist
- [ ] NGINX running: `sudo systemctl status nginx`
- [ ] SSL cert exists: `ls /etc/letsencrypt/live/yourdomain.com/`
- [ ] curl returns HTTP/2 (not HTTP/1.1)
- [ ] NGINX config validates: `sudo nginx -t`

**If SSL not working:**
```bash
# Regenerate certificate
sudo certbot certonly --nginx -d yourdomain.com

# Check expiry
openssl x509 -in /etc/letsencrypt/live/yourdomain.com/cert.pem -noout -dates
```

---

## 🚀 Step 4: Check Application is Running

### Verify Next.js is running
```bash
# Check PM2 status
pm2 status

# Should show "land-management" with status "online"

# Check if port 3000 is listening
sudo netstat -tulnp | grep 3000
# Should show: LISTEN ... 127.0.0.1:3000

# Check recent logs for errors
pm2 logs land-management --lines 50
```

### ✅ Checklist
- [ ] PM2 shows "online" status for land-management
- [ ] Port 3000 is listening on 127.0.0.1
- [ ] No critical errors in logs (check for ❌ symbols)
- [ ] No "MongoDB connection failed" messages

**If app not running:**
```bash
# Restart
pm2 restart land-management

# Check for startup errors
pm2 logs land-management --err

# Check permissions on .env.production
ls -la .env.production
# Should be readable by app user
```

---

## 🔐 Step 5: Test Login Endpoint

### Direct API Test (No Browser)
```bash
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vtgroups.com",
    "password": "Admin@123"
  }' \
  -v  # -v shows headers including cookies

# Look for:
# - "HTTP/2 200" (success) or "HTTP/2 401" (failure)
# - "set-cookie: token=..." (if login successful)
```

### ✅ Checklist for Successful Response
- [ ] Status: HTTP/2 200 (or 201)
- [ ] Response contains: `"success": true`
- [ ] Response contains: `"user": { "id": "...", "email": "...", "role": "admin" }`
- [ ] Headers show: `set-cookie: token=...`

### ❌ If Login Fails (HTTP 401)

**Step A: Check logs for detailed error**
```bash
pm2 logs land-management | grep "LOGIN"

# Look for these error messages:
[LOGIN-abc123] ❌ User not found
[LOGIN-abc123] ❌ Password mismatch
[LOGIN-abc123] ❌ Account is deactivated
[LOGIN-abc123] ❌ MongoDB connection failed
[LOGIN-abc123] ❌ JWT generation failed
```

**Step B: Correlate to issue and fix**
```
❌ User not found
  → Check if user exists in DB: mongosh ... db.users.find()
  → Create user if missing

❌ Password mismatch
  → Verify correct credentials
  → Check if password was properly hashed in DB
  → Check password comparison in User model

❌ Account is deactivated
  → In mongosh: db.users.updateOne({email: "admin@vtgroups.com"}, {$set: {isActive: true}})

❌ MongoDB connection failed
  → Check MONGODB_URI in .env.production
  → Check VPS IP whitelisted in MongoDB Atlas
  → Check credentials are correct

❌ JWT generation failed
  → Check JWT_SECRET is set
  → Check if jwt library is installed: npm ls jsonwebtoken
```

---

## 🍪 Step 6: Verify Cookies are Working

### Check if Cookie is Being Sent
```bash
# Make login request and check Set-Cookie header
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vtgroups.com","password":"Admin@123"}' \
  -v 2>&1 | grep -i "set-cookie"

# Should output something like:
# set-cookie: token=eyJhbGciOiJIUzI1NiIs...; Path=/; HttpOnly; Max-Age=604800; SameSite=Lax
```

### ✅ Checklist
- [ ] `set-cookie` header is present
- [ ] Cookie name is `token`
- [ ] `HttpOnly` flag is set (secure)
- [ ] `SameSite=Lax` (or `None` if cross-domain)

### ❌ If Cookie Not Being Set

**Check if HTTPS is working:**
```bash
curl -I https://yourdomain.com | head -1
# Should show: HTTP/2 (not HTTP/1.1)
```

**Check NGINX X-Forwarded-Proto header:**
```bash
# In NGINX config, should have:
proxy_set_header X-Forwarded-Proto $scheme;

# Reload NGINX if added
sudo systemctl reload nginx
```

---

## 🧪 Step 7: Browser Test

### Last Step: Full User Test
```
1. Open https://yourdomain.com in browser
2. Navigate to /login
3. Enter credentials: admin@vtgroups.com / Admin@123
4. Click "Sign In"
5. Should redirect to /admin dashboard
```

### ✅ Checklist
- [ ] Page loads without SSL errors
- [ ] Login form appears
- [ ] Can type in email/password
- [ ] After submit, page redirects
- [ ] Dashboard loads with data

### ❌ If Dashboard is Blank
```
Possible causes:
1. Frontend not receiving cookie
   → Check browser DevTools: Application → Cookies → Should show "token"
   
2. /admin route not authorized
   → Check middleware.ts verifying JWT
   → Check token not expired
   
3. API calls failing silently
   → Check browser console for errors
   → Check /api/admin/stats or other API endpoints returning data

Solution:
- Hard refresh browser: Ctrl+Shift+R
- Clear cookies: Settings → Clear browsing data → Cookies
- Try incognito window
- Check browser console for errors
```

---

## 📋 Complete Troubleshooting Flow

Run through in this order:

```
1. Environment Variables ✓
   └─ JWT_SECRET set? ✓
   └─ MONGODB_URI correct? ✓
   └─ NODE_ENV=production? ✓

2. Database ✓
   └─ Can connect with mongosh? ✓
   └─ User exists in DB? ✓
   └─ VPS IP whitelisted? ✓

3. HTTPS/SSL ✓
   └─ SSL cert valid? ✓
   └─ NGINX listening on 443? ✓
   └─ curl returns HTTP/2? ✓

4. Application ✓
   └─ PM2 status is "online"? ✓
   └─ Port 3000 listening? ✓
   └─ No critical errors in logs? ✓

5. Login API ✓
   └─ curl returns HTTP 200? ✓
   └─ Response has "success": true? ✓
   └─ set-cookie header present? ✓

6. Browser ✓
   └─ Can access https://yourdomain.com? ✓
   └─ Login redirects to dashboard? ✓
   └─ Dashboard shows data? ✓
```

---

## 🆘 Emergency Commands

If everything fails:

```bash
# 1. Stop and view all logs
pm2 stop land-management
pm2 logs land-management --lines 200 --err

# 2. Check system resources
free -h
df -h

# 3. Check if app crashes on startup
NODE_ENV=production pnpm start 2>&1 | head -50

# 4. Verify database is accessible from VPS
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/land_management"

# 5. Check NGINX is forwarding properly
sudo tail -f /var/log/nginx/land-management-error.log

# 6. Restart everything
sudo systemctl restart nginx
pm2 restart land-management

# 7. Monitor
pm2 monit
```

---

## 📊 Health Check URLs

Test these URLs to verify different components:

```bash
# Frontend loads
curl https://yourdomain.com

# NGINX health endpoint
curl https://yourdomain.com/health

# API endpoint (no auth required)
curl https://yourdomain.com/api/seed

# Auth endpoint (requires POST with JSON)
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vtgroups.com","password":"Admin@123"}'
```

---

**All checks passing? You're done! Authentication should be fully functional.**

**Still having issues? Check pm2 logs for [LOGIN-xxx] messages with ❌ symbols - they will tell you exactly what's failing.**
