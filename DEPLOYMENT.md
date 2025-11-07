# Deployment Guide - CSI NMAMIT Full Stack

This guide covers deploying both the frontend (React/Vite) and backend (Node.js/Express) to various platforms.

## Table of Contents
- [Frontend Deployment](#frontend-deployment)
- [Backend Deployment](#backend-deployment)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Security Checklist](#security-checklist)

---

## Frontend Deployment

### Option 1: Vercel (Recommended for Frontend)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Configure Environment Variables**
- Go to Vercel Dashboard → Project → Settings → Environment Variables
- Add all `VITE_*` variables from your `.env` file

4. **Set Production Backend URL**
```
VITE_API_BASE_URL=https://your-backend-domain.com
```

### Option 2: Netlify

1. **Build the project**
```bash
npm run build
```

2. **Deploy via Netlify CLI**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

3. **Configure**
- Add environment variables in Netlify Dashboard
- Set build command: `npm run build`
- Set publish directory: `dist`

### Option 3: GitHub Pages

1. **Update `vite.config.js`**
```javascript
export default {
  base: '/repository-name/',
  // ... rest of config
}
```

2. **Build and deploy**
```bash
npm run build
npx gh-pages -d dist
```

---

## Backend Deployment

### Option 1: Render (Recommended for Backend)

1. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Select the `backend` directory

2. **Configure Build Settings**
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment: Node

3. **Add Environment Variables**
```
NODE_ENV=production
PORT=10000
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=your_secret
FRONTEND_URL=https://your-frontend.vercel.app
FIREBASE_PROJECT_ID=your_project
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@xxx.iam.gserviceaccount.com
```

4. **Deploy**
   - Click "Create Web Service"
   - Backend will be available at: `https://your-app.onrender.com`

### Option 2: Railway

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login and Initialize**
```bash
railway login
railway init
```

3. **Deploy**
```bash
cd backend
railway up
```

4. **Add Environment Variables**
```bash
railway variables set NODE_ENV=production
railway variables set RAZORPAY_KEY_ID=rzp_live_xxx
railway variables set RAZORPAY_KEY_SECRET=your_secret
# ... add all other variables
```

### Option 3: Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login and Create App**
```bash
cd backend
heroku login
heroku create csi-backend
```

3. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set RAZORPAY_KEY_ID=rzp_live_xxx
heroku config:set RAZORPAY_KEY_SECRET=your_secret
heroku config:set FRONTEND_URL=https://your-frontend.vercel.app
# ... set all other variables
```

4. **Create Procfile**
```
web: node server.js
```

5. **Deploy**
```bash
git subtree push --prefix backend heroku main
```

### Option 4: AWS EC2 / DigitalOcean Droplet

1. **Setup Server**
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2
```

2. **Clone and Setup**
```bash
git clone your-repo
cd your-repo/backend
npm install
```

3. **Configure Environment**
```bash
nano .env
# Add all environment variables
```

4. **Start with PM2**
```bash
pm2 start server.js --name csi-backend
pm2 startup
pm2 save
```

5. **Setup Nginx Reverse Proxy**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

6. **Setup SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 5: Docker Deployment

1. **Build Docker Image**
```bash
cd backend
docker build -t csi-backend .
```

2. **Run Container**
```bash
docker run -d \
  -p 5000:5000 \
  --env-file .env \
  --name csi-backend \
  csi-backend
```

3. **Using Docker Compose**
```bash
docker-compose up -d
```

---

## Environment Variables

### Frontend (.env)
```env
# Production Frontend Environment Variables
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxx
VITE_API_BASE_URL=https://your-backend-domain.com

VITE_CORE_MEMBERS_DATA=base64_encoded_data
VITE_SECURITY_SALT=your_production_salt
VITE_APP_ENV=production
```

### Backend (.env)
```env
# Production Backend Environment Variables
NODE_ENV=production
PORT=5000

RAZORPAY_KEY_ID=rzp_live_xxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

FRONTEND_URL=https://your-frontend-domain.com

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@xxx.iam.gserviceaccount.com

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Database Setup

### Firebase Configuration

1. **Create Production Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project or use existing

2. **Enable Services**
   - Authentication → Enable Google Sign-in
   - Firestore Database → Create database
   - Storage → Initialize

3. **Set Security Rules**

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Payment orders (write from backend only)
    match /payment_orders/{orderId} {
      allow read: if request.auth != null;
      allow write: if false; // Only backend can write
    }
    
    // Payments (read for own payments)
    match /payments/{paymentId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow write: if false; // Only backend can write
    }
    
    // Events
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

4. **Generate Service Account Key**
   - Project Settings → Service Accounts
   - Generate new private key
   - Save securely and add to backend environment

---

## Razorpay Configuration

### Production Setup

1. **Activate Live Mode**
   - Complete KYC verification
   - Add bank account details
   - Submit required documents

2. **Generate Live API Keys**
   - Dashboard → Settings → API Keys
   - Generate Live Keys
   - Copy Key ID and Secret

3. **Configure Webhooks**
   - Dashboard → Webhooks
   - Add webhook URL: `https://your-backend.com/api/payments/webhook`
   - Select events:
     - payment.authorized
     - payment.captured
     - payment.failed
     - order.paid
   - Generate and save webhook secret

4. **Update Environment Variables**
```env
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=your_live_secret
RAZORPAY_WEBHOOK_SECRET=webhook_secret
```

---

## Security Checklist

### Pre-Deployment

- [ ] All environment variables are set correctly
- [ ] `.env` files are NOT committed to git
- [ ] Firebase security rules are configured
- [ ] CORS is configured with specific origins (not `*`)
- [ ] Rate limiting is enabled
- [ ] HTTPS/SSL is configured
- [ ] Webhook signature verification is enabled
- [ ] Test mode keys are replaced with live keys
- [ ] Input validation is working
- [ ] Error messages don't expose sensitive data

### Post-Deployment

- [ ] Test payment flow end-to-end
- [ ] Verify webhook is receiving events
- [ ] Check logs for errors
- [ ] Monitor payment success rate
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure backup for Firebase
- [ ] Set up monitoring/alerting
- [ ] Document API endpoints
- [ ] Test failure scenarios
- [ ] Verify refund process

---

## Monitoring and Maintenance

### Backend Monitoring

**Using PM2:**
```bash
pm2 logs csi-backend
pm2 monit
pm2 restart csi-backend
```

**Health Check:**
```bash
curl https://your-backend.com/health
```

### Error Tracking

**Integrate Sentry:**
```bash
npm install @sentry/node
```

```javascript
// In server.js
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
})
```

### Log Management

**Structured Logging:**
```javascript
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})
```

---

## Troubleshooting

### Common Issues

**Issue: CORS errors in production**
- Ensure `FRONTEND_URL` in backend matches your frontend domain
- Check CORS configuration in `server.js`

**Issue: Payment verification fails**
- Verify Razorpay secret key is correct
- Check signature calculation in logs
- Ensure webhook secret is configured

**Issue: Firebase authentication fails**
- Verify Firebase credentials are correct
- Check private key formatting (newlines)
- Ensure service account has proper permissions

**Issue: 502 Bad Gateway**
- Check if backend is running: `pm2 status`
- Verify port binding
- Check Nginx/reverse proxy configuration

---

## Performance Optimization

### Frontend
- Enable CDN caching
- Optimize images
- Lazy load components
- Enable service worker

### Backend
- Enable compression
- Implement caching
- Use connection pooling
- Optimize database queries

---

## Backup Strategy

### Database Backups
```bash
# Automated Firebase backup
gcloud firestore export gs://your-bucket/backups/$(date +%Y%m%d)
```

### Environment Backup
- Store encrypted backups of `.env` files
- Use secret management tools (AWS Secrets Manager, HashiCorp Vault)

---

## Support

For deployment issues:
1. Check deployment platform logs
2. Review backend error logs
3. Test API endpoints individually
4. Verify environment variables
5. Check Firebase/Razorpay dashboards

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Razorpay Documentation](https://razorpay.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/docs)
