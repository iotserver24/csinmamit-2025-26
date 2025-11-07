import express from 'express'
import {
  createOrder,
  verifyPayment,
  getPaymentDetails,
  getOrderDetails,
  getAllPayments,
  refundPayment,
  webhookHandler
} from '../controllers/paymentController.js'
import {
  validateCreateOrder,
  validateVerifyPayment,
  validateRefundPayment
} from '../middleware/validators.js'
import { authenticateUser, optionalAuth } from '../middleware/auth.js'

const router = express.Router()

router.post('/create-order', validateCreateOrder, createOrder)

router.post('/verify-payment', validateVerifyPayment, verifyPayment)

router.get('/payment/:paymentId', optionalAuth, getPaymentDetails)

router.get('/order/:orderId', optionalAuth, getOrderDetails)

router.get('/all', authenticateUser, getAllPayments)

router.post('/refund/:paymentId', authenticateUser, validateRefundPayment, refundPayment)

router.post('/webhook', webhookHandler)

export default router
