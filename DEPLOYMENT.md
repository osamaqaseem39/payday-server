# Deployment Guide for Payday Server

## Vercel Deployment Issues & Solutions

### Current Issues:
1. **MongoDB Connection Timeout**: `Operation 'users.findOne()' buffering timed out after 10000ms`
2. **401 Unauthorized Errors**: Missing authentication tokens
3. **500 Internal Server Error**: Server errors due to missing environment variables

### Step 1: Set Up MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account
   - Create a new cluster (M0 Free tier is sufficient)

2. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `payday-dashboard`

### Step 2: Configure Vercel Environment Variables

1. **Go to Vercel Dashboard**:
   - Navigate to your project on [Vercel Dashboard](https://vercel.com/dashboard)
   - Click on your `payday-server` project

2. **Add Environment Variables**:
   - Go to "Settings" → "Environment Variables"
   - Add the following variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/payday-dashboard?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=3002
NODE_ENV=production
```

3. **Redeploy**:
   - After adding environment variables, redeploy your application
   - Go to "Deployments" and click "Redeploy"

### Step 3: Test the Connection

1. **Health Check**:
   ```bash
   curl https://payday-server.vercel.app/api/health
   ```

2. **Test MongoDB Connection**:
   ```bash
   curl https://payday-server.vercel.app/api/auth/login
   ```

### Step 4: Create Initial Admin User

After MongoDB is connected, you need to create an admin user:

1. **Use the registration endpoint**:
   ```bash
   curl -X POST https://payday-server.vercel.app/api/auth/register \
   -H "Content-Type: application/json" \
   -d '{
     "name": "Admin User",
     "email": "admin@paydayexpress.com",
     "password": "admin123",
     "role": "admin"
   }'
   ```

2. **Login to get JWT token**:
   ```bash
   curl -X POST https://payday-server.vercel.app/api/auth/login \
   -H "Content-Type: application/json" \
   -d '{
     "email": "admin@paydayexpress.com",
     "password": "admin123"
   }'
   ```

### Step 5: Update Frontend Configuration

If you're using a different backend URL, update the frontend:

1. **Update API_BASE_URL** in all frontend files:
   ```typescript
   const API_BASE_URL = 'https://payday-server.vercel.app/api';
   ```

### Alternative: Local Development Setup

If you prefer to run locally:

1. **Create .env file**:
   ```bash
   cd payday-dashboard
   cp env.example .env
   ```

2. **Update .env with your MongoDB URI**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/payday-dashboard?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=3002
   NODE_ENV=development
   ```

3. **Start the server**:
   ```bash
   npm install
   npm start
   ```

### Troubleshooting

#### MongoDB Connection Issues:
- Check if your MongoDB Atlas IP whitelist includes `0.0.0.0/0` (all IPs)
- Verify your connection string format
- Ensure your database user has read/write permissions

#### JWT Issues:
- Make sure `JWT_SECRET` is set and is a strong secret
- Check if tokens are being sent in Authorization header

#### CORS Issues:
- The server has CORS enabled for all origins
- If you need specific origins, update the CORS configuration

### Monitoring

1. **Check Vercel Logs**:
   - Go to your Vercel project → "Functions" → "server.js"
   - Check for any error logs

2. **Test API Endpoints**:
   - Use tools like Postman or curl to test endpoints
   - Start with `/api/health` endpoint

### Security Notes

1. **Change Default Passwords**: Always change default admin passwords
2. **Use Strong JWT Secret**: Generate a strong random string for JWT_SECRET
3. **Environment Variables**: Never commit .env files to version control
4. **MongoDB Security**: Use MongoDB Atlas security features (IP whitelist, etc.)

## Quick Fix Commands

```bash
# Test MongoDB connection locally
cd payday-dashboard
node test-mongo.js

# Test server health
curl https://payday-server.vercel.app/api/health

# Create admin user (after MongoDB is connected)
curl -X POST https://payday-server.vercel.app/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name":"Admin","email":"admin@paydayexpress.com","password":"admin123","role":"admin"}'
``` 