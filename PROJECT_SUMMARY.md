# CSI NMAMIT Full Stack Project Summary

## Overview
This project is a complete full-stack web application for CSI NMAMIT (Computer Society of India - NMAMIT Student Branch) with secure payment processing using Razorpay.

## Architecture

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **Authentication**: Firebase Auth (Google Sign-in)
- **Database**: Firebase Firestore
- **Payment UI**: Razorpay Checkout

### Backend (NEW)
- **Runtime**: Node.js with Express.js
- **Payment Processing**: Razorpay SDK
- **Database**: Firebase Admin SDK
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator

## Directory Structure

```
csi-nmamit/
├── src/                          # Frontend React application
│   ├── components/               # React components
│   ├── pages/                    # Page components
│   ├── contexts/                 # Context providers
│   ├── hooks/                    # Custom React hooks
│   ├── services/                 # API and Firebase services
│   ├── utils/                    # Utility functions
│   └── config/                   # Configuration files
│
├── backend/                      # Node.js backend (NEW)
│   ├── config/                   # Razorpay & Firebase config
│   │   ├── razorpay.js
│   │   └── firebase.js
│   ├── controllers/              # Request handlers
│   │   └── paymentController.js
│   ├── middleware/               # Express middleware
│   │   ├── auth.js
│   │   ├── validators.js
│   │   └── errorHandler.js
│   ├── routes/                   # API routes
│   │   └── paymentRoutes.js
│   ├── services/                 # Business logic
│   │   └── paymentService.js
│   ├── utils/                    # Helper functions
│   │   └── helpers.js
│   ├── server.js                 # Entry point
│   ├── package.json              # Dependencies
│   ├── .env.example              # Environment template
│   ├── .gitignore               # Git ignore rules
│   ├── Dockerfile               # Docker configuration
│   ├── docker-compose.yml       # Docker Compose setup
│   ├── ecosystem.config.js      # PM2 configuration
│   ├── test-api.sh              # API test script
│   ├── README.md                # Backend documentation
│   ├── QUICK_START.md           # Quick setup guide
│   └── FEATURES.md              # Feature documentation
│
├── public/                       # Static assets
├── .env.example                  # Frontend env template
├── package.json                  # Frontend dependencies
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
├── README.md                     # Main documentation
├── BACKEND_INTEGRATION.md       # Integration guide
├── DEPLOYMENT.md                # Deployment guide
├── PROJECT_SUMMARY.md           # This file
└── setup.sh                     # Setup script
```

## Key Features

### Payment Processing
✅ Secure order creation with Razorpay
✅ HMAC SHA256 signature verification
✅ Automatic membership updates
✅ Transaction tracking and logging
✅ Webhook support for events
✅ Refund processing
✅ Payment history management

### Security
✅ Firebase Authentication
✅ Protected API routes
✅ Input validation and sanitization
✅ Rate limiting (100 req/15min)
✅ CORS protection
✅ Security headers (Helmet)
✅ Environment variable protection
✅ Transaction audit trail

### User Features
✅ Google Sign-in
✅ Profile management
✅ Event registration
✅ Membership purchase
✅ Payment tracking
✅ Certificate generation
✅ Dashboard with analytics

### Admin Features
✅ OTP-protected admin access
✅ User management
✅ Event management
✅ Member management
✅ Payment management
✅ Activity logging

## API Endpoints

### Payment APIs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/payments/create-order` | Create payment order | No |
| POST | `/api/payments/verify-payment` | Verify payment | No |
| GET | `/api/payments/payment/:id` | Get payment details | Optional |
| GET | `/api/payments/order/:id` | Get order details | Optional |
| GET | `/api/payments/all` | List all payments | Yes |
| POST | `/api/payments/refund/:id` | Process refund | Yes |
| POST | `/api/payments/webhook` | Razorpay webhook | No |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |

## Environment Variables

### Frontend (.env)
```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_RAZORPAY_KEY_ID=
VITE_API_BASE_URL=http://localhost:5000
VITE_CORE_MEMBERS_DATA=
VITE_SECURITY_SALT=
VITE_APP_ENV=development
```

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
FRONTEND_URL=http://localhost:5173
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Setup Instructions

### Quick Setup (Automated)
```bash
./setup.sh
```

### Manual Setup

#### 1. Frontend Setup
```bash
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

#### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with Razorpay credentials
npm run dev
```

#### 3. Access
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health: http://localhost:5000/health

## Development Workflow

### Running Both Servers

Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
npm run backend:dev
```

Or use separate terminals:
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
npm run dev
```

## Testing

### Backend API Testing
```bash
cd backend
./test-api.sh
```

### Manual Testing with cURL
```bash
# Health Check
curl http://localhost:5000/health

# Create Order
curl -X POST http://localhost:5000/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d @test-data.json
```

### Frontend Testing
1. Navigate to http://localhost:5173/recruit
2. Sign in with Google
3. Fill registration form
4. Select membership plan
5. Complete payment with test card: 4111 1111 1111 1111

## Payment Flow

```
User → Frontend → Backend → Razorpay → Backend → Firebase → Frontend
```

1. **User** fills registration form
2. **Frontend** calls backend `/create-order`
3. **Backend** creates order with Razorpay
4. **Backend** saves order to Firebase
5. **Frontend** opens Razorpay checkout
6. **User** completes payment
7. **Razorpay** processes payment
8. **Frontend** receives payment response
9. **Frontend** calls backend `/verify-payment`
10. **Backend** verifies signature
11. **Backend** saves payment to Firebase
12. **Backend** updates user membership
13. **Frontend** shows success message

## Deployment

### Frontend Deployment (Vercel)
```bash
vercel
```

### Backend Deployment (Render/Railway/Heroku)
```bash
# See DEPLOYMENT.md for detailed instructions
```

### Docker Deployment
```bash
cd backend
docker-compose up -d
```

## Documentation

| Document | Description |
|----------|-------------|
| [README.md](./README.md) | Main project documentation |
| [backend/README.md](./backend/README.md) | Backend API documentation |
| [backend/QUICK_START.md](./backend/QUICK_START.md) | Quick setup guide |
| [backend/FEATURES.md](./backend/FEATURES.md) | Feature list |
| [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) | Integration guide |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deployment guide |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | This document |

## Dependencies

### Frontend
- react ^18.2.0
- react-router-dom ^6.22.0
- firebase ^10.8.0
- framer-motion ^12.23.15
- tailwindcss ^3.4.1
- lucide-react ^0.358.0

### Backend
- express ^4.18.2
- razorpay ^2.9.2
- firebase-admin ^12.0.0
- express-validator ^7.0.1
- helmet ^7.1.0
- cors ^2.8.5
- dotenv ^16.3.1
- morgan ^1.10.0

## Security Features

### Frontend
- Firebase Authentication
- Protected Routes
- Input Sanitization
- CSP Headers
- Rate Limiting

### Backend
- HMAC SHA256 Verification
- Express Validator
- Helmet Security Headers
- CORS Protection
- Rate Limiting (100/15min)
- Firebase Admin Auth
- Transaction Logging

## Performance

### Frontend
- Vite for fast builds
- Code splitting
- Lazy loading
- Optimized animations
- Image optimization

### Backend
- Stateless design
- Connection reuse
- Efficient queries
- Horizontal scaling ready
- PM2 cluster mode

## Monitoring

### Health Check
```bash
curl http://localhost:5000/health
```

### Logs
```bash
# Backend logs with PM2
pm2 logs csi-backend

# Backend logs (development)
npm run dev
```

## Troubleshooting

### Common Issues

**CORS Error**
- Check `FRONTEND_URL` in backend `.env`
- Ensure it matches frontend URL

**Payment Verification Fails**
- Verify Razorpay key secret
- Check signature calculation
- Review backend logs

**Firebase Errors**
- Check credentials in `.env`
- Verify service account permissions
- Check security rules

## Support

For issues:
1. Check relevant documentation
2. Review error logs
3. Verify environment variables
4. Test API endpoints individually
5. Check Firebase/Razorpay dashboards

## Contributors

Developed by CSI NMAMIT Tech Team

## License

MIT License

---

## Quick Reference

### Start Development
```bash
./setup.sh          # One-time setup
npm run dev         # Frontend
npm run backend:dev # Backend
```

### Test Backend
```bash
cd backend
./test-api.sh
```

### Deploy
```bash
npm run build       # Frontend
# See DEPLOYMENT.md for backend
```

### Check Health
```bash
curl http://localhost:5000/health
```

### View Logs
```bash
pm2 logs csi-backend
```

---

**Last Updated**: December 2024
**Version**: 2.0.0
**Status**: Production Ready ✅
