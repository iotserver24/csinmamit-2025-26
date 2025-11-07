import razorpayInstance from '../config/razorpay.js'
import { getFirestore } from '../config/firebase.js'
import crypto from 'crypto'

class PaymentService {
  constructor() {
    this.db = getFirestore()
  }

  async createOrder(orderData) {
    try {
      const options = {
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        receipt: orderData.receipt,
        notes: orderData.notes || {}
      }

      const order = await razorpayInstance.orders.create(options)
      
      if (this.db) {
        await this.db.collection('payment_orders').doc(order.id).set({
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
          status: order.status,
          notes: order.notes,
          userId: orderData.userId,
          planId: orderData.planId,
          formData: orderData.formData,
          transactionId: orderData.transactionId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }

      return order
    } catch (error) {
      console.error('Create order error:', error)
      throw new Error('Failed to create payment order')
    }
  }

  verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    try {
      const text = `${razorpayOrderId}|${razorpayPaymentId}`
      const secret = process.env.RAZORPAY_KEY_SECRET

      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(text)
        .digest('hex')

      return generatedSignature === razorpaySignature
    } catch (error) {
      console.error('Signature verification error:', error)
      return false
    }
  }

  async verifyAndSavePayment(paymentData) {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        transactionId
      } = paymentData

      const isValid = this.verifyPaymentSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      )

      if (!isValid) {
        throw new Error('Invalid payment signature')
      }

      const payment = await razorpayInstance.payments.fetch(razorpay_payment_id)

      if (this.db) {
        const orderRef = this.db.collection('payment_orders').doc(razorpay_order_id)
        const orderDoc = await orderRef.get()

        if (!orderDoc.exists) {
          throw new Error('Order not found')
        }

        const orderData = orderDoc.data()

        await this.db.collection('payments').doc(razorpay_payment_id).set({
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          transactionId: transactionId,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          email: payment.email,
          contact: payment.contact,
          userId: orderData.userId,
          planId: orderData.planId,
          formData: orderData.formData,
          verified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          razorpayResponse: {
            id: payment.id,
            entity: payment.entity,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            order_id: payment.order_id,
            method: payment.method,
            captured: payment.captured,
            email: payment.email,
            contact: payment.contact,
            created_at: payment.created_at
          }
        })

        await orderRef.update({
          status: 'paid',
          paymentId: razorpay_payment_id,
          updatedAt: new Date().toISOString()
        })

        if (orderData.userId) {
          await this.updateUserMembership(orderData.userId, orderData.planId, razorpay_payment_id)
        }
      }

      return {
        verified: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        transactionId: transactionId,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency
      }
    } catch (error) {
      console.error('Payment verification error:', error)
      
      if (this.db && paymentData.razorpay_payment_id) {
        await this.db.collection('payment_failures').add({
          ...paymentData,
          error: error.message,
          timestamp: new Date().toISOString()
        })
      }

      throw error
    }
  }

  async updateUserMembership(userId, planId, paymentId) {
    try {
      if (!this.db) return

      const userRef = this.db.collection('users').doc(userId)
      const userDoc = await userRef.get()

      const planDurations = {
        'annual': 365,
        'semester': 180,
        'monthly': 30
      }

      const durationDays = planDurations[planId] || 365
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + durationDays)

      const membershipData = {
        isMember: true,
        membershipType: planId,
        membershipStartDate: new Date().toISOString(),
        membershipExpiryDate: expiryDate.toISOString(),
        paymentId: paymentId,
        updatedAt: new Date().toISOString()
      }

      if (userDoc.exists) {
        await userRef.update(membershipData)
      } else {
        await userRef.set({
          ...membershipData,
          createdAt: new Date().toISOString()
        })
      }

      console.log(`✅ Membership updated for user: ${userId}`)
    } catch (error) {
      console.error('Update membership error:', error)
    }
  }

  async getPaymentDetails(paymentId) {
    try {
      const payment = await razorpayInstance.payments.fetch(paymentId)
      return payment
    } catch (error) {
      console.error('Get payment details error:', error)
      throw new Error('Failed to fetch payment details')
    }
  }

  async getOrderDetails(orderId) {
    try {
      const order = await razorpayInstance.orders.fetch(orderId)
      return order
    } catch (error) {
      console.error('Get order details error:', error)
      throw new Error('Failed to fetch order details')
    }
  }

  async getAllPayments(skip = 0, limit = 10) {
    try {
      const payments = await razorpayInstance.orders.all({
        skip,
        count: limit
      })
      return payments
    } catch (error) {
      console.error('Get all payments error:', error)
      throw new Error('Failed to fetch payments')
    }
  }

  async refundPayment(paymentId, amount) {
    try {
      const refund = await razorpayInstance.payments.refund(paymentId, {
        amount: amount,
        speed: 'normal'
      })

      if (this.db) {
        await this.db.collection('refunds').doc(refund.id).set({
          refundId: refund.id,
          paymentId: paymentId,
          amount: refund.amount,
          status: refund.status,
          createdAt: new Date().toISOString()
        })
      }

      return refund
    } catch (error) {
      console.error('Refund payment error:', error)
      throw new Error('Failed to process refund')
    }
  }
}

export default new PaymentService()
