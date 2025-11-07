import paymentService from '../services/paymentService.js'
import { validationResult } from 'express-validator'

export const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const { userId, planId, amount, formData, transactionId } = req.body

    const orderData = {
      amount: amount,
      currency: 'INR',
      receipt: `CSI_${transactionId}`,
      userId,
      planId,
      formData,
      transactionId,
      notes: {
        userId,
        planId,
        transactionId,
        name: formData.name,
        email: formData.email,
        usn: formData.usn
      }
    }

    const order = await paymentService.createOrder(orderData)

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        transactionId: transactionId
      }
    })
  } catch (error) {
    console.error('Create order error:', error)
    next(error)
  }
}

export const verifyPayment = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const paymentData = req.body

    const result = await paymentService.verifyAndSavePayment(paymentData)

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: result
    })
  } catch (error) {
    console.error('Verify payment error:', error)
    res.status(400).json({
      success: false,
      message: error.message || 'Payment verification failed'
    })
  }
}

export const getPaymentDetails = async (req, res, next) => {
  try {
    const { paymentId } = req.params

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required'
      })
    }

    const payment = await paymentService.getPaymentDetails(paymentId)

    res.status(200).json({
      success: true,
      data: payment
    })
  } catch (error) {
    console.error('Get payment details error:', error)
    next(error)
  }
}

export const getOrderDetails = async (req, res, next) => {
  try {
    const { orderId } = req.params

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      })
    }

    const order = await paymentService.getOrderDetails(orderId)

    res.status(200).json({
      success: true,
      data: order
    })
  } catch (error) {
    console.error('Get order details error:', error)
    next(error)
  }
}

export const getAllPayments = async (req, res, next) => {
  try {
    const skip = parseInt(req.query.skip) || 0
    const limit = parseInt(req.query.limit) || 10

    const payments = await paymentService.getAllPayments(skip, limit)

    res.status(200).json({
      success: true,
      data: payments
    })
  } catch (error) {
    console.error('Get all payments error:', error)
    next(error)
  }
}

export const refundPayment = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const { paymentId } = req.params
    const { amount } = req.body

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required'
      })
    }

    const refund = await paymentService.refundPayment(paymentId, amount)

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: refund
    })
  } catch (error) {
    console.error('Refund payment error:', error)
    next(error)
  }
}

export const webhookHandler = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
    const signature = req.headers['x-razorpay-signature']

    if (webhookSecret) {
      const crypto = await import('crypto')
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex')

      if (signature !== expectedSignature) {
        return res.status(400).json({
          success: false,
          message: 'Invalid webhook signature'
        })
      }
    }

    const event = req.body.event
    const payload = req.body.payload

    console.log(`📩 Webhook received: ${event}`)

    switch (event) {
      case 'payment.authorized':
        console.log('Payment authorized:', payload.payment.entity.id)
        break
      case 'payment.captured':
        console.log('Payment captured:', payload.payment.entity.id)
        break
      case 'payment.failed':
        console.log('Payment failed:', payload.payment.entity.id)
        break
      case 'order.paid':
        console.log('Order paid:', payload.order.entity.id)
        break
      default:
        console.log('Unhandled webhook event:', event)
    }

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed'
    })
  }
}
