// Import JWT
import jwt from 'jsonwebtoken'

// Import JWT config
import jwtConfig from '../../config/jwtConfig.js'

// Import models
import User from '../models/user.js'

// Import Firebase apps
import { firebaseAdminApp } from '../../utils/firebaseInitialization.js'

// Authenticate users by JWT & Firebase
const authenticateUser = async (req, res, next) => {
  try {
    let token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    )
      token = req.headers.authorization.split(' ')[1]
    else
      return res.status(401).json({
        message: 'Unauthorized, please sign in',
      })

    let decodedJwtToken
    try {
      decodedJwtToken = jwt.verify(token, jwtConfig.JWT_SECRET)
    } catch (err) {
      if (err.name === 'JsonWebTokenError')
        return res.status(401).json({
          message: 'Please sign in',
        })
      else if (err.name === 'TokenExpiredError')
        return res.status(401).json({
          message: 'Token expired, please sign in',
        })
    }

    await firebaseAdminApp
      .auth()
      .verifyIdToken(decodedJwtToken.accessToken)
      .then(async (decodedToken) => {
        const authAccount = await User.findOne({
          where: {
            email: decodedToken.email,
          },
        })

        if (authAccount === null)
          return res.status(404).json({
            message: 'User is not found',
          })
        else {
          req.currentUser = {
            ...decodedJwtToken,
          }
          next()
        }
      })
      .catch((error) => {
        let errorCode = error.code

        if (errorCode === 'auth/id-token-expired')
          return res.status(401).json({
            message: 'Token has expired, please sign in',
          })
      })
  } catch (err) {
    console.log(err)
    console.log('Catch - authenticateUser - middlewares')

    res.status(400).json({
      message: 'Something went wrong',
    })
  }
}

export default authenticateUser
