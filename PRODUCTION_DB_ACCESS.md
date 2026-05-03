# Production Database Access Guide

## 🔒 Security First
**NEVER expose your production database directly to the internet!**

## Methods to Access Production DB

### 1. SSH Tunneling (Recommended) ⭐

**Most Secure** - Database never exposed, all traffic encrypted through SSH.

#### Setup:
```bash
# Create SSH tunnel to your production server
ssh -L 5432:localhost:5432 user@your-production-server.com

# Or if DB is on different port:
ssh -L 5432:db-host:5432 user@your-production-server.com

# Keep this terminal open, then connect with:
# Host: localhost
# Port: 5432
# Database: challan_db
# User: challan
# Password: (from production .env)
```

#### Using DBeaver:
1. Create new PostgreSQL connection
2. Host: `localhost`
3. Port: `5432` (or your tunneled port)
4. Database: `challan_db`
5. User/Password: from production env

---

### 2. Cloud Provider Console Tools

#### AWS RDS:
- AWS Console → RDS → Select Database → Query Editor
- Or use AWS Systems Manager Session Manager

#### Google Cloud SQL:
- Cloud Console → SQL → Select Instance → Connect using Cloud Shell
- Or use Cloud SQL Proxy

#### DigitalOcean:
- Managed Databases → Access → Connection Pooling
- Or use DO's web console

#### Railway/Render/Vercel:
- Most provide database access through their dashboard
- Check your hosting provider's documentation

---

### 3. VPN Access

If your production is behind a VPN:
1. Connect to company/production VPN
2. Connect to DB as if it's local
3. Use DBeaver/pgAdmin with internal IP

---

### 4. Prisma Studio (If Backend is Accessible)

If you can SSH into your production server:

```bash
# SSH into production
ssh user@your-production-server.com

# Navigate to backend
cd /path/to/backend

# Set production DATABASE_URL
export DATABASE_URL="postgresql://user:pass@host:5432/db"

# Run Prisma Studio
npx prisma studio --port 5555

# Access via: http://localhost:5555 (if port forwarded)
# Or use SSH port forwarding:
# ssh -L 5555:localhost:5555 user@your-production-server.com
```

---

### 5. Direct Connection (Only if Secured)

**⚠️ Only use if:**
- Database has SSL/TLS enabled
- IP whitelisting configured
- Strong passwords
- Firewall rules in place

**Connection String:**
```
Host: your-db-host.com
Port: 5432
Database: challan_db
SSL Mode: Require
User: challan
Password: (from production env)
```

---

## 🔐 Best Practices

### 1. Use Environment Variables
Never hardcode production credentials:
```bash
# Production .env
DATABASE_URL=postgresql://user:password@host:5432/db?sslmode=require
```

### 2. IP Whitelisting
Only allow specific IPs to connect:
```sql
-- In PostgreSQL
CREATE USER challan WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE challan_db TO challan;
-- Restrict to specific IPs in pg_hba.conf
```

### 3. SSL/TLS Required
Always use encrypted connections in production:
```
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

### 4. Read-Only Access
Create read-only user for queries:
```sql
CREATE USER readonly_user WITH PASSWORD 'password';
GRANT CONNECT ON DATABASE challan_db TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
```

### 5. Audit Logging
Enable query logging for production access:
```sql
-- In postgresql.conf
log_statement = 'all'
log_connections = on
log_disconnections = on
```

---

## 🛠️ Quick Access Scripts

### SSH Tunnel Script
Create `scripts/connect-prod-db.sh`:
```bash
#!/bin/bash
# Usage: ./connect-prod-db.sh

PROD_SERVER="user@your-server.com"
DB_HOST="localhost"  # or internal DB host
DB_PORT="5432"
LOCAL_PORT="5432"

echo "Creating SSH tunnel to production database..."
echo "Connect using: localhost:$LOCAL_PORT"
echo "Press Ctrl+C to close tunnel"

ssh -L $LOCAL_PORT:$DB_HOST:$DB_PORT $PROD_SERVER -N
```

### Prisma Studio on Production
Create `scripts/prod-studio.sh`:
```bash
#!/bin/bash
# Usage: ./prod-studio.sh

ssh user@your-server.com "cd /path/to/backend && \
  export DATABASE_URL='$PROD_DATABASE_URL' && \
  npx prisma studio --port 5555" &

# Forward port
ssh -L 5555:localhost:5555 user@your-server.com -N
```

---

## 📊 Recommended Tools for Production

1. **DBeaver** - Best for SSH tunneling
2. **pgAdmin** - Official PostgreSQL tool
3. **TablePlus** - Clean UI, supports SSH
4. **DataGrip** (JetBrains) - Paid but excellent
5. **Prisma Studio** - If you can access backend

---

## 🚨 Emergency Access

If you need immediate access and SSH isn't available:

1. **Cloud Provider Console** - Use web-based query editor
2. **Temporary IP Whitelist** - Add your IP, access, then remove
3. **Read Replica** - Query read replica instead of primary
4. **Backup Restore** - Restore backup locally for investigation

---

## ⚠️ Security Checklist

- [ ] Database not exposed to public internet
- [ ] SSL/TLS encryption enabled
- [ ] Strong passwords (16+ chars, random)
- [ ] IP whitelisting configured
- [ ] Read-only user for queries
- [ ] Audit logging enabled
- [ ] Regular security updates
- [ ] Backup strategy in place
- [ ] Connection limits configured
- [ ] No credentials in code/repos

---

## 📝 Notes

- Always use SSH tunneling when possible
- Never commit production credentials
- Use read-only access for queries
- Log all production database access
- Have a rollback plan before making changes
