# Quick Start Guide - CSI NMAMIT Payment Backend

This guide will help you get the payment backend up and running quickly.

## Prerequisites

- Node.js 16+ installed
- Razorpay account (Sign up at https://razorpay.com)
- Firebase project (Optional, but recommended)

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Razorpay Credentials (REQUIRED)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Firebase (Optional - for production)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
```

### Getting Razorpay Keys

1. Sign up at https://dashboard.razorpay.com/
2. Go to Settings → API Keys
3. Generate Test/Live keys
4. Copy Key ID and Key Secret to `.env`

### Firebase Setup (Optional but recommended)

Option 1: Using Service Account File
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save the JSON file as `firebase-adminsdk.json` in backend folder
4. Add to `.env`: `FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-adminsdk.json`

Option 2: Using Environment Variables
1. Copy values from the JSON file to `.env` as shown above

## Step 3: Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on http://localhost:5000

## Step 4: Test the API

### Test Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test Create Order
```bash
curl -X POST http://localhost:5000/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test123",
    "planId": "annual",
    "amount": 50000,
    "transactionId": "TXN_TEST_123",
    "formData": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "9876543210",
      "branch": "CSE",
      "year": "3",
      "usn": "4NM21CS123"
    }
  }'
```

## Step 5: Connect Frontend

In your frontend `.env` file, add:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
```

The frontend payment service will automatically use the backend API when `VITE_API_BASE_URL` is set.

## Common Issues and Solutions

### Issue: "Razorpay credentials are not configured"
**Solution:** Make sure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set in `.env`

### Issue: "CORS error when calling API from frontend"
**Solution:** Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL

### Issue: "Firebase Admin SDK not configured"
**Solution:** This is a warning, not an error. The backend will work without Firebase but won't persist data. To enable Firebase, follow Step 2 above.

### Issue: Port 5000 already in use
**Solution:** Change `PORT=5000` to another port in `.env`, e.g., `PORT=5001`

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use production Razorpay keys
3. Configure proper CORS origins
4. Set up SSL/TLS certificate
5. Use process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name csi-backend
   pm2 save
   ```

## Next Steps

- Set up Razorpay webhooks for automatic payment notifications
- Configure Firebase for data persistence
- Review the main [README.md](./README.md) for complete API documentation
- Test payment flow end-to-end with frontend

## Support

For issues, check:
1. Server logs for error messages
2. Environment variables are correctly set
3. Razorpay dashboard for payment status
4. Firebase console for data persistence

## Security Checklist

- ✅ Never commit `.env` file
- ✅ Use test keys for development
- ✅ Enable rate limiting in production
- ✅ Set up proper CORS configuration
- ✅ Keep dependencies updated
- ✅ Enable HTTPS in production
