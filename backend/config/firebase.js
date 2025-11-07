import admin from 'firebase-admin'
import dotenv from 'dotenv'

dotenv.config()

let firebaseApp = null

const initializeFirebase = async () => {
  try {
    if (!firebaseApp) {
      // Check if service account file exists
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_PATH

      if (serviceAccount) {
        // Initialize with service account file
        const { readFileSync } = await import('fs')
        const serviceAccountKey = JSON.parse(readFileSync(serviceAccount, 'utf8'))
        
        firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccountKey)
        })
      } else if (process.env.FIREBASE_PROJECT_ID && 
                 process.env.FIREBASE_PRIVATE_KEY && 
                 process.env.FIREBASE_CLIENT_EMAIL) {
        // Initialize with environment variables
        firebaseApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          })
        })
      } else {
        console.warn('⚠️  Firebase Admin SDK not configured. Running without Firebase integration.')
        return null
      }

      console.log('✅ Firebase Admin initialized successfully')
    }
    return firebaseApp
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message)
    return null
  }
}

const getFirestore = () => {
  const app = initializeFirebase()
  return app ? admin.firestore() : null
}

const getAuth = () => {
  const app = initializeFirebase()
  return app ? admin.auth() : null
}

export { initializeFirebase, getFirestore, getAuth }
export default admin
