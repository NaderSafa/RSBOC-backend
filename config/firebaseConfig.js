// Import enviroment variables
import dotenv from 'dotenv'
dotenv.config()

// Firebase SDK Configuration
const firebaseSDKConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
}

// Firebase Admin Configuration
const firebaseAdminConfig = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
}

export default { firebaseSDKConfig, firebaseAdminConfig }
