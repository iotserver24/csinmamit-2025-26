# CSI NMAMIT Backend - Payment API

Node.js backend service for handling Razorpay payment integration with Firebase for CSI NMAMIT website.

## Features

- 🔐 Secure payment processing with Razorpay
- ✅ Payment signature verification
- 🔥 Firebase integration for data persistence
- 🛡️ Input validation and sanitization
- 🚦 Rate limiting protection
- 📝 Comprehensive logging
- 🔄 Webhook support
- 💳 Refund processing
- 🔒 Authentication middleware

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Razorpay** - Payment gateway
- **Firebase Admin SDK** - Database and authentication
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:5173
```

## Configuration

### Razorpay Setup

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Get your API keys from the dashboard
3. Add them to your `.env` file

### Firebase Setup

Option 1: Using Service Account File
- Download your Firebase service account JSON file
- Save it securely (e.g., `firebase-adminsdk.json`)
- Add path to `.env`: `FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-adminsdk.json`

Option 2: Using Environment Variables
- Add to `.env`:
```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Endpoints

### Payment Endpoints

#### Create Order
```http
POST /api/payments/create-order
Content-Type: application/json

{
  "userId": "user123",
  "planId": "annual",
  "amount": 50000,
  "transactionId": "TXN_123",
  "formData": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "branch": "CSE",
    "year": "3",
    "usn": "4NM21CS123"
  }
}
```

Response:
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "order_xyz123",
    "amount": 50000,
    "currency": "INR",
    "transactionId": "TXN_123"
  }
}
```

#### Verify Payment
```http
POST /api/payments/verify-payment
Content-Type: application/json

{
  "razorpay_payment_id": "pay_xyz123",
  "razorpay_order_id": "order_xyz123",
  "razorpay_signature": "signature_hash",
  "transactionId": "TXN_123"
}
```

Response:
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "verified": true,
    "paymentId": "pay_xyz123",
    "orderId": "order_xyz123",
    "transactionId": "TXN_123",
    "status": "captured",
    "amount": 50000,
    "currency": "INR"
  }
}
```

#### Get Payment Details
```http
GET /api/payments/payment/:paymentId
Authorization: Bearer <token> (optional)
```

#### Get Order Details
```http
GET /api/payments/order/:orderId
Authorization: Bearer <token> (optional)
```

#### Get All Payments
```http
GET /api/payments/all?skip=0&limit=10
Authorization: Bearer <token>
```

#### Refund Payment
```http
POST /api/payments/refund/:paymentId
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 50000
}
```

#### Webhook Endpoint
```http
POST /api/payments/webhook
X-Razorpay-Signature: <signature>

{
  "event": "payment.captured",
  "payload": { ... }
}
```

### Health Check
```http
GET /health
```

Response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Security Features

### Rate Limiting
- Default: 100 requests per 15 minutes per IP
- Configurable via environment variables

### Input Validation
- All inputs are validated using express-validator
- Sanitization of form data
- USN format validation
- Email and phone number validation

### Payment Security
- HMAC SHA256 signature verification
- Secure webhook handling
- Transaction ID tracking
- Failed payment logging

### Firebase Integration
- Secure authentication using Firebase ID tokens
- User membership updates
- Payment history tracking
- Order status management

## Project Structure

```
backend/
├── config/
│   ├── firebase.js          # Firebase Admin configuration
│   └── razorpay.js          # Razorpay instance
├── controllers/
│   └── paymentController.js # Payment business logic
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── errorHandler.js      # Error handling
│   └── validators.js        # Input validation rules
├── routes/
│   └── paymentRoutes.js     # API routes
├── services/
│   └── paymentService.js    # Payment service layer
├── utils/
│   └── helpers.js           # Utility functions
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
├── README.md              # Documentation
└── server.js              # Entry point
```

## Error Handling

All errors are handled centrally and return consistent JSON responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## Logging

- HTTP request logging using Morgan
- Activity logging for important operations
- Error logging for debugging

## Frontend Integration

Update your frontend's payment service to use the backend API:

```javascript
// In your frontend code
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// Create order
const response = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userId,
    planId,
    amount,
    transactionId,
    formData
  })
})

// Verify payment
const verifyResponse = await fetch(`${API_BASE_URL}/api/payments/verify-payment`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    transactionId
  })
})
```

## Testing

### Manual Testing with cURL

Create Order:
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

Health Check:
```bash
curl http://localhost:5000/health
```

## Deployment

### Using PM2 (Recommended for Production)

1. Install PM2:
```bash
npm install -g pm2
```

2. Start the server:
```bash
pm2 start server.js --name csi-backend
```

3. Configure PM2 to start on boot:
```bash
pm2 startup
pm2 save
```

### Using Docker

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t csi-backend .
docker run -p 5000:5000 --env-file .env csi-backend
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
RAZORPAY_KEY_ID=your_production_key
RAZORPAY_KEY_SECRET=your_production_secret
FRONTEND_URL=https://your-domain.com
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

## Webhook Configuration

1. Go to Razorpay Dashboard → Webhooks
2. Add webhook URL: `https://your-domain.com/api/payments/webhook`
3. Select events to listen:
   - payment.authorized
   - payment.captured
   - payment.failed
   - order.paid
4. Copy the webhook secret to your `.env` file

## Support

For issues and questions, please contact the CSI NMAMIT technical team.

## License

MIT License - See LICENSE file for details
