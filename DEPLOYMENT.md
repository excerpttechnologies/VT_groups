# Deployment Guide - VT Groups

## Post-Deployment Setup

After deploying your Next.js app, follow these steps to set up your production environment:

### 1. Environment Variables

Set the following environment variables in your deployment platform:

```
MONGODB_URI=your-production-mongodb-connection-string
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRES_IN=7d
SEED_TOKEN=your-secure-seed-token
NODE_ENV=production
```

### 2. Seed the Database

Once deployed, seed the production database with test users:

```bash
# Replace YOUR_DOMAIN and YOUR_SEED_TOKEN with your actual values
curl -X GET "https://YOUR_DOMAIN/api/seed?token=YOUR_SEED_TOKEN"
```

Or check if seeding is needed:
```bash
curl -X GET "https://YOUR_DOMAIN/api/seed"
```

### 3. Test Login

After seeding, use these credentials to test:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@vtgroups.com | Admin@123 |
| Employee | employee@vtgroups.com | Emp@123 |
| Customer | customer@vtgroups.com | Cust@123 |

### 4. Troubleshooting

**Error: "Invalid credentials" on login**
- ✅ Make sure you've run the seed endpoint
- ✅ Check that MONGODB_URI is correct and has network access
- ✅ Verify the database is connected
- ✅ Check server logs: `POST /api/seed` should show success

**Error: "Seeding is disabled in production"**
- You need to provide the SEED_TOKEN parameter with your seed token
- Example: `https://YOUR_DOMAIN/api/seed?token=your-seed-token`

**Connection Timeout**
- MongoDB Atlas: Add your deployment IP to whitelist
- Check your MONGODB_URI connection string
- Verify credentials are correct

### 5. Security Notes

- Change all default passwords after first login
- Rotate JWT_SECRET regularly
- Use environment-specific SEED_TOKEN values
- Disable seed endpoint in production once setup is complete

### 6. Local Development

To seed locally:
```bash
curl http://localhost:3000/api/seed
```

No token required in development mode.

---

**Support Email:** contact@vtgroups.com
