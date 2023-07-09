import firebaseConfig from '../config/firebaseConfig.js'

//Importing firebase client & firebase admin modules
import firebaseAdmin from 'firebase-admin'
import { initializeApp } from 'firebase/app'

//Initializing firebase
const firebaseApp = initializeApp(firebaseConfig.firebaseSDKConfig)
const firebaseAdminApp = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseConfig.firebaseAdminConfig),
})

//Exporting firebase apps
export { firebaseApp, firebaseAdminApp }
