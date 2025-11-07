import { getAuth } from '../config/firebase.js'

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - No token provided'
      })
    }

    const token = authHeader.split('Bearer ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Invalid token format'
      })
    }

    const auth = getAuth()
    
    if (!auth) {
      console.warn('Firebase Auth not initialized, skipping authentication')
      return next()
    }

    try {
      const decodedToken = await auth.verifyIdToken(token)
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified
      }
      next()
    } catch (error) {
      console.error('Token verification error:', error)
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Invalid token'
      })
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return res.status(500).json({
      success: false,
      message: 'Authentication failed'
    })
  }
}

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next()
    }

    const token = authHeader.split('Bearer ')[1]
    const auth = getAuth()
    
    if (!auth) {
      return next()
    }

    try {
      const decodedToken = await auth.verifyIdToken(token)
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified
      }
    } catch (error) {
      console.error('Optional auth token verification failed:', error)
    }

    next()
  } catch (error) {
    console.error('Optional authentication error:', error)
    next()
  }
}
