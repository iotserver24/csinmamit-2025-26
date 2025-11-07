# Backend Integration Guide

This guide explains how to integrate the Node.js backend with the React frontend for Razorpay payment processing.

## Overview

The backend provides a secure API for:
- Creating payment orders
- Verifying payment signatures
- Managing payment data in Firebase
- Processing refunds
- Handling webhooks

## Setup

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

The backend will run on http://localhost:5000

### 2. Frontend Configuration

Update your frontend `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Frontend Payment Service Integration

The existing `paymentService.js` already has backend integration built-in. When `VITE_API_BASE_URL` is set, it will automatically use the backend API.

### Current Flow

1. **Frontend** calls `paymentService.createOrder()` 
2. If `VITE_API_BASE_URL` is set → calls backend `/api/payments/create-order`
3. Backend creates order with Razorpay and returns order details
4. **Frontend** opens Razorpay checkout modal
5. User completes payment
6. **Frontend** calls `paymentService.verifyPayment()`
7. If `VITE_API_BASE_URL` is set → calls backend `/api/payments/verify-payment`
8. Backend verifies signature and saves to Firebase
9. User membership is updated automatically

### Payment Flow Diagram

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend  │         │   Backend   │         │   Razorpay   │         │   Firebase   │
└──────┬──────┘         └──────┬──────┘         └──────┬───────┘         └──────┬───────┘
       │                       │                       │                        │
       │  Create Order         │                       │                        │
       ├──────────────────────>│                       │                        │
       │                       │  Create Order         │                        │
       │                       ├──────────────────────>│                        │
       │                       │  Order Details        │                        │
       │                       │<──────────────────────┤                        │
       │  Order Details        │                       │                        │
       │<──────────────────────┤                       │                        │
       │                       │                       │                        │
       │  Open Checkout        │                       │                        │
       ├───────────────────────┼──────────────────────>│                        │
       │                       │                       │                        │
       │  Payment Success      │                       │                        │
       │<──────────────────────┼───────────────────────┤                        │
       │                       │                       │                        │
       │  Verify Payment       │                       │                        │
       ├──────────────────────>│                       │                        │
       │                       │  Verify Signature     │                        │
       │                       ├───────────────────────┼───────────────────────>│
       │                       │                       │  Fetch Payment         │
       │                       ├──────────────────────>│                        │
       │                       │  Payment Details      │                        │
       │                       │<──────────────────────┤                        │
       │                       │  Save Payment Data    │                        │
       │                       ├───────────────────────┼───────────────────────>│
       │                       │  Update Membership    │                        │
       │                       ├───────────────────────┼───────────────────────>│
       │  Verification Result  │                       │                        │
       │<──────────────────────┤                       │                        │
       │                       │                       │                        │
```

## Testing the Integration

### 1. Start Both Servers

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
npm run dev
```

### 2. Test Payment Flow

1. Navigate to http://localhost:5173/recruit
2. Sign in with Google
3. Fill the registration form
4. Select a membership plan
5. Click "Proceed to Payment"
6. Complete payment using test card:
   - Card: 4111 1111 1111 1111
   - Any future expiry date
   - Any CVV

### 3. Verify in Backend Logs

You should see logs like:
```
Order created: order_xyz123
Payment verified: pay_xyz123
Membership updated for user: user123
```

### 4. Verify in Firebase

Check Firebase Console:
- `payment_orders` collection - Order details
- `payments` collection - Payment records
- `users` collection - Updated membership status

## API Endpoints Used by Frontend

### 1. Create Order

**Endpoint:** `POST /api/payments/create-order`

**Frontend Code:**
```javascript
const response = await fetch(`${apiBaseUrl}/api/payments/create-order`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId,
    planId,
    amount,
    formData,
    transactionId
  })
})
```

### 2. Verify Payment

**Endpoint:** `POST /api/payments/verify-payment`

**Frontend Code:**
```javascript
const response = await fetch(`${apiBaseUrl}/api/payments/verify-payment`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    transactionId
  })
})
```

## Enhanced Security Features

The backend provides:

1. **Signature Verification**: HMAC SHA256 verification of Razorpay signatures
2. **Input Validation**: Express-validator for all inputs
3. **Rate Limiting**: Prevents abuse (100 req/15min by default)
4. **Sanitization**: Removes harmful characters from user input
5. **CORS Protection**: Only allows requests from configured frontend
6. **Transaction Tracking**: Unique transaction IDs for audit trail

## Production Deployment

### Backend Deployment

1. **Deploy to Cloud Provider** (Heroku, Railway, Render, etc.)
   
   Example for Heroku:
   ```bash
   cd backend
   heroku create csi-backend
   heroku config:set NODE_ENV=production
   heroku config:set RAZORPAY_KEY_ID=rzp_live_xxx
   heroku config:set RAZORPAY_KEY_SECRET=xxx
   git push heroku main
   ```

2. **Update Frontend `.env`**
   ```env
   VITE_API_BASE_URL=https://csi-backend.herokuapp.com
   VITE_RAZORPAY_KEY_ID=rzp_live_xxx
   ```

3. **Configure CORS in Backend**
   ```env
   FRONTEND_URL=https://your-domain.com
   ```

### Razorpay Webhook Setup

1. Go to Razorpay Dashboard → Webhooks
2. Add webhook URL: `https://your-backend-domain.com/api/payments/webhook`
3. Select events:
   - payment.authorized
   - payment.captured
   - payment.failed
   - order.paid
4. Copy webhook secret to backend `.env`:
   ```env
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```

## Monitoring and Debugging

### Backend Logs

Check logs for payment activities:
```bash
# Development
npm run dev

# Production with PM2
pm2 logs csi-backend
```

### Common Issues

**Issue:** Payment verification fails
- Check Razorpay key secret is correct
- Verify signature format in frontend
- Check backend logs for detailed error

**Issue:** CORS errors
- Ensure `FRONTEND_URL` matches your frontend domain
- Check browser console for exact error

**Issue:** Firebase data not saving
- Verify Firebase credentials are configured
- Check Firebase security rules
- Review backend logs for Firebase errors

## Testing with Razorpay Test Mode

### Test Cards

- **Success:** 4111 1111 1111 1111
- **Failure:** 4000 0000 0000 0002

### Test UPI

- **Success:** success@razorpay
- **Failure:** failure@razorpay

## Migration from Frontend-Only to Backend

If you were using frontend-only payments before:

1. Add `VITE_API_BASE_URL` to `.env` - that's it!
2. The existing `paymentService.js` will automatically use the backend
3. No code changes needed in components

## Support

For integration issues:
1. Check backend logs: `npm run dev` (backend)
2. Check frontend console: Browser DevTools
3. Verify environment variables are set correctly
4. Review Razorpay dashboard for payment status

## Best Practices

1. **Never expose** `RAZORPAY_KEY_SECRET` in frontend
2. **Always verify** payments on backend
3. **Use webhooks** for reliable payment notifications
4. **Log all transactions** for audit trail
5. **Test thoroughly** with Razorpay test mode
6. **Monitor** backend logs in production
7. **Set up alerts** for payment failures

## Next Steps

1. Set up monitoring (e.g., Sentry, LogRocket)
2. Configure automated backups for Firebase
3. Implement payment retry logic
4. Add email notifications for payments
5. Create admin dashboard for payment management
