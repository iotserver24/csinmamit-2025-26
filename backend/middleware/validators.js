import { body, param } from 'express-validator'

export const validateCreateOrder = [
  body('userId')
    .trim()
    .notEmpty()
    .withMessage('User ID is required')
    .isString()
    .withMessage('User ID must be a string'),
  
  body('planId')
    .trim()
    .notEmpty()
    .withMessage('Plan ID is required')
    .isIn(['annual', 'semester', 'monthly'])
    .withMessage('Invalid plan ID'),
  
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isInt({ min: 100 })
    .withMessage('Amount must be at least 100 paise (1 INR)'),
  
  body('transactionId')
    .trim()
    .notEmpty()
    .withMessage('Transaction ID is required'),
  
  body('formData.name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('formData.email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('formData.phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Invalid phone number format'),
  
  body('formData.branch')
    .trim()
    .notEmpty()
    .withMessage('Branch is required'),
  
  body('formData.year')
    .trim()
    .notEmpty()
    .withMessage('Year is required'),
  
  body('formData.usn')
    .trim()
    .notEmpty()
    .withMessage('USN is required')
    .matches(/^[1-4]NM(2[0-9])[A-Z]{2}\d{3}$/i)
    .withMessage('Invalid USN format')
]

export const validateVerifyPayment = [
  body('razorpay_payment_id')
    .trim()
    .notEmpty()
    .withMessage('Razorpay payment ID is required'),
  
  body('razorpay_order_id')
    .trim()
    .notEmpty()
    .withMessage('Razorpay order ID is required'),
  
  body('razorpay_signature')
    .trim()
    .notEmpty()
    .withMessage('Razorpay signature is required'),
  
  body('transactionId')
    .trim()
    .notEmpty()
    .withMessage('Transaction ID is required')
]

export const validateRefundPayment = [
  param('paymentId')
    .trim()
    .notEmpty()
    .withMessage('Payment ID is required'),
  
  body('amount')
    .optional()
    .isInt({ min: 100 })
    .withMessage('Amount must be at least 100 paise (1 INR)')
]
