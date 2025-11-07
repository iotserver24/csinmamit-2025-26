import Razorpay from 'razorpay'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('⚠️  Razorpay credentials are not configured')
}

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export default razorpayInstance
