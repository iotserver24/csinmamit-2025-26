import crypto from 'crypto'

export const generateTransactionId = () => {
  const timestamp = Date.now().toString(36)
  const randomStr = crypto.randomBytes(8).toString('hex')
  return `TXN_${timestamp}_${randomStr}`.toUpperCase()
}

export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '')
  }
  return input
}

export const sanitizeFormData = (formData) => {
  const sanitized = {}
  for (const [key, value] of Object.entries(formData)) {
    sanitized[key] = sanitizeInput(value)
  }
  return sanitized
}

export const validateAmount = (amount, minAmount = 100) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new Error('Invalid amount format')
  }
  
  if (amount < minAmount) {
    throw new Error(`Amount must be at least ${minAmount}`)
  }
  
  if (amount > 10000000) {
    throw new Error('Amount exceeds maximum limit')
  }
  
  return true
}

export const formatCurrency = (amount, currency = 'INR') => {
  const amountInRupees = amount / 100
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency
  }).format(amountInRupees)
}

export const isValidUSN = (usn) => {
  const usnRegex = /^[1-4]NM(2[0-9])[A-Z]{2}\d{3}$/i
  return usnRegex.test(usn)
}

export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone)
}

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const logActivity = (activity, userId = null) => {
  const timestamp = new Date().toISOString()
  const logMessage = `[${timestamp}] ${userId ? `User: ${userId} - ` : ''}${activity}`
  console.log(logMessage)
  return logMessage
}
