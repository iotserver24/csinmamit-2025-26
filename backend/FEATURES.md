# Backend Features - CSI NMAMIT Payment API

## Core Features

### 1. Payment Order Creation
- Creates Razorpay orders with proper validation
- Generates unique transaction IDs
- Stores order details in Firebase
- Includes user and plan metadata
- Returns order details for frontend checkout

### 2. Payment Signature Verification
- HMAC SHA256 signature verification
- Validates Razorpay payment responses
- Prevents tampering and fraud
- Ensures payment authenticity

### 3. Automatic Membership Management
- Updates user membership status after successful payment
- Calculates membership expiry dates
- Stores payment history
- Links payments to user accounts

### 4. Transaction Tracking
- Unique transaction IDs for audit trail
- Payment status tracking
- Order status management
- Failed payment logging

### 5. Webhook Support
- Receives Razorpay webhook events
- Signature verification for webhooks
- Handles multiple event types:
  - payment.authorized
  - payment.captured
  - payment.failed
  - order.paid

### 6. Refund Processing
- Process full or partial refunds
- Logs refund transactions
- Updates payment status
- Integrates with Razorpay refund API

### 7. Payment Details Retrieval
- Fetch payment details by ID
- Get order information
- List all payments (paginated)
- Admin access controls

## Security Features

### Input Validation
- Express Validator for all inputs
- Email format validation
- Phone number validation (Indian format)
- USN format validation (NMAMIT specific)
- Amount validation (min/max limits)

### Rate Limiting
- Configurable rate limits
- Default: 100 requests per 15 minutes
- Per-IP rate limiting
- Prevents abuse and DDoS

### CORS Protection
- Configurable allowed origins
- Credentials support
- Pre-flight request handling
- Environment-based configuration

### Security Headers
- Helmet.js integration
- XSS protection
- Content Security Policy
- Frame options
- MIME type sniffing prevention

### Authentication
- Firebase ID token verification
- Optional authentication for public endpoints
- User context in authenticated requests
- Admin role verification (ready for implementation)

### Data Sanitization
- HTML tag removal
- SQL injection prevention
- XSS attack prevention
- Safe string handling

## Firebase Integration

### Collections Used

#### payment_orders
```javascript
{
  orderId: "order_xyz123",
  amount: 50000,
  currency: "INR",
  status: "created",
  userId: "user123",
  planId: "annual",
  formData: { /* user details */ },
  transactionId: "TXN_XXX",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

#### payments
```javascript
{
  paymentId: "pay_xyz123",
  orderId: "order_xyz123",
  transactionId: "TXN_XXX",
  amount: 50000,
  currency: "INR",
  status: "captured",
  method: "card",
  userId: "user123",
  planId: "annual",
  verified: true,
  razorpayResponse: { /* full payment details */ },
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

#### users (membership update)
```javascript
{
  isMember: true,
  membershipType: "annual",
  membershipStartDate: "2024-01-01T00:00:00.000Z",
  membershipExpiryDate: "2025-01-01T00:00:00.000Z",
  paymentId: "pay_xyz123"
}
```

#### payment_failures
```javascript
{
  razorpay_payment_id: "pay_xyz123",
  razorpay_order_id: "order_xyz123",
  error: "Invalid signature",
  timestamp: "2024-01-01T00:00:00.000Z"
}
```

#### refunds
```javascript
{
  refundId: "rfnd_xyz123",
  paymentId: "pay_xyz123",
  amount: 50000,
  status: "processed",
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

## Error Handling

### Graceful Degradation
- Works without Firebase (logs warnings)
- Continues if Firebase write fails
- Returns appropriate error codes
- Detailed error messages in development

### Error Response Format
```javascript
{
  success: false,
  message: "Error description",
  errors: [/* validation errors */]
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

## Logging

### Request Logging
- Morgan HTTP logger
- Development: detailed logs
- Production: combined format
- Timestamp tracking

### Activity Logging
- Order creation
- Payment verification
- Membership updates
- Failed payments
- Refunds

### Error Logging
- Stack traces in development
- Sanitized errors in production
- Firebase write failures
- Razorpay API errors

## API Response Examples

### Successful Order Creation
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "order_MBpQz3gGKzUxQ8",
    "amount": 50000,
    "currency": "INR",
    "transactionId": "TXN_L1G7F68E_A1B2C3D4"
  }
}
```

### Successful Payment Verification
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "verified": true,
    "paymentId": "pay_MBpQz3gGKzUxQ8",
    "orderId": "order_MBpQz3gGKzUxQ8",
    "transactionId": "TXN_L1G7F68E_A1B2C3D4",
    "status": "captured",
    "amount": 50000,
    "currency": "INR"
  }
}
```

### Validation Error
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Invalid email format",
      "param": "formData.email",
      "location": "body"
    },
    {
      "msg": "USN is required",
      "param": "formData.usn",
      "location": "body"
    }
  ]
}
```

## Configuration Options

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | No | 5000 | Server port |
| NODE_ENV | No | development | Environment mode |
| RAZORPAY_KEY_ID | Yes | - | Razorpay key ID |
| RAZORPAY_KEY_SECRET | Yes | - | Razorpay secret key |
| FRONTEND_URL | No | http://localhost:5173 | CORS origin |
| RATE_LIMIT_WINDOW_MS | No | 900000 | Rate limit window |
| RATE_LIMIT_MAX_REQUESTS | No | 100 | Max requests per window |
| FIREBASE_PROJECT_ID | No | - | Firebase project ID |
| FIREBASE_PRIVATE_KEY | No | - | Firebase private key |
| FIREBASE_CLIENT_EMAIL | No | - | Firebase client email |

## Performance Features

### Efficient Data Handling
- Minimal data transformation
- Direct Razorpay SDK usage
- Optimized Firebase queries
- Connection reuse

### Scalability
- Stateless design
- Horizontal scaling ready
- PM2 cluster mode support
- Docker containerization

### Caching (Ready for Implementation)
- Redis integration ready
- Response caching
- Session management
- Rate limit storage

## Testing Features

### Manual Testing
- Health check endpoint
- Shell script for API testing
- cURL examples in documentation
- Postman collection ready

### Test Mode Support
- Razorpay test keys
- Mock data generation
- Development logging
- Sandbox environment

## Extensibility

### Easy to Extend
- Modular architecture
- Clear separation of concerns
- Service-based design
- Middleware pattern

### Future Enhancements
- Multiple payment gateways
- Subscription management
- Payment analytics
- Advanced fraud detection
- Email notifications
- SMS notifications
- Receipt generation
- Tax invoice creation

## Compliance

### Data Privacy
- Minimal data storage
- No sensitive card data storage
- PCI DSS compliant (via Razorpay)
- GDPR considerations

### Audit Trail
- Transaction logging
- User activity tracking
- Payment history
- Refund records

## Monitoring

### Health Checks
- `/health` endpoint
- Server status
- Timestamp tracking
- Quick status verification

### Metrics (Ready for Implementation)
- Payment success rate
- Average response time
- Error rate
- Webhook delivery status

## Documentation

### Comprehensive Docs
- API endpoint documentation
- Setup instructions
- Deployment guides
- Troubleshooting guides
- Integration examples

### Code Documentation
- Inline comments
- Function documentation
- Parameter descriptions
- Return value documentation

## Support Features

### Developer Experience
- Clear error messages
- Helpful validation feedback
- Detailed logging
- Example requests

### Production Ready
- PM2 ecosystem file
- Docker support
- Environment validation
- Graceful error handling
