import User from '../models/user.js'
import Developer from '../models/developer.js'
import Attachment from '../models/attachment.js'
import jwt from 'jsonwebtoken'

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'

import jwtConfig from '../../config/jwtConfig.js'
import { firebaseApp } from '../../utils/firebaseInitialization.js'
import mailHtml from '../../assets/mail.html.js'
import mailService from '../../utils/mailService.js'
import { APP_URL } from '../../config/urls.js'

const auth = getAuth(firebaseApp)

const getDeveloperTitle = (req, res) => {
  User.findOne({ uid: req.params.user_id }, (error, user) => {
    if (error) {
      console.log(error)
      res.status(500).send(error)
    } else if (user) {
      if (user.developerId) {
        Developer.findById(user.developerId, (error, developer) => {
          res.send(developer.title)
        })
      } else {
        res.send(404)
      }
    } else {
      res.status(404).send({ message: `User not found` })
    }
  })
}

// Handle index actions
const findAll = (req, res) => {
  User.find({}, (error, users) => {
    if (error) {
      console.log(error)
      res.status(500).send(error)
    } else {
      console.log(req.params)
      req.query.token === 'wvGe5xbCkyiDcpnFTbzex8iQsYHceSYR'
        ? res.send(users)
        : res.send('Success')
    }
  })
}

const findOne = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.currentUser.email,
    })

    if (!user) {
      return
      res.status(400).json({
        message: 'User not found.',
      })
    }
    res.status(200).json({
      message: 'Fetched user',
      user,
    })
    console.log('step')
  } catch (err) {
    console.log(err)
    console.log('Catch - findOne - UsersController')

    res.status(400).json({
      message: 'Something went wrong.',
    })
  }
}

// POST: Register using email
const register = async (req, res) => {
  try {
    const { email, full_name } = req.body
    const user = await User.findOne({
      email,
    })
    if (user)
      return res.status(400).json({
        message: 'User already existed',
      })
    const newUser = await User.create({
      email,
      full_name,
    })

    mailService.sendMail(
      email,
      'Verify your account.',
      null,
      mailHtml(
        full_name,
        `Follow the below link to verify your email address. 
        If you didn’t ask to verify this address, you can ignore this email.`,
        'Verify your account',
        email,
        'Verify your account',
        `${APP_URL}/create-password/?id=${newUser.id}`
      )
    )
    res.status(200).json({
      message: 'User created.',
    })
  } catch (err) {
    console.log(err)
    console.log('Catch - signup - UsersController')

    res.status(400).json({
      message: 'Something went wrong.',
    })
  }
}

//POST: Verify email using email & password
const verifyEmail = async (req, res) => {
  try {
    const { id, password } = req.body
    const user = await User.findById(id)
    if (!user)
      return res.status(404).json({
        message: 'User not found.',
      })
    createUserWithEmailAndPassword(auth, user.email, password)
      .then(async (fbUser) => {
        await User.updateOne(
          {
            _id: id,
          },
          {
            $set: {
              verified: true,
              uid: fbUser.user.uid,
            },
          }
        )

        res.status(200).json({
          message: 'User is verified.',
        })
      })
      .catch((error) => {
        let errorCode = error.code
        let message
        switch (errorCode) {
          case 'auth/email-already-in-use':
            message = 'Email already registered.'
            break

          case 'auth/invalid-email':
            message = 'Invalid email.'
            break

          case 'auth/operation-not-allowed':
            message = 'Email/password accounts are not enabled in firebase.'
            break

          case 'auth/weak-password':
            message = 'Weak password.'
            break
        }

        console.log(error)
        return res.status(406).json({
          message: message ? message : 'Something went wrong.',
        })
      })
  } catch (err) {
    console.log(err)
    console.log('Catch - VerifyEmail - UsersController')

    res.status(400).json({
      message: 'Something went wrong.',
    })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(404).json({
        message: 'Either your login email or password is incorrect.',
      })
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        let tokenCriteria = {
          email,
          role: user.role,
          accessToken: await userCredential.user.getIdToken(),
          id: user.id,
        }

        const userDB = await User.findOne({ uid: userCredential.user.uid })

        if (!userDB) return res.status(404).json({ message: 'User not found.' })
        // Adding pharmacy or supplier id

        const accessToken = jwt.sign(tokenCriteria, jwtConfig.JWT_SECRET)

        return res.status(200).json({
          message: 'Login successful.',
          accessToken,
        })
      })
      .catch((error) => {
        let errorCode = error.code
        let message
        switch (errorCode) {
          case 'auth/email-already-in-use':
            message = 'Email already registered.'
            break

          case 'auth/invalid-email':
            message = 'Invalid email.'
            break

          case 'auth/operation-not-allowed':
            message = 'Email/password accounts are not enabled in firebase.'
            break

          case 'auth/weak-password':
            message = 'Weak password.'
            break
          case 'auth/wrong-password':
            message = 'Wrong username or password.'
            break
        }
      })
  } catch (err) {
    console.log(err)
    console.log('Catch - signin - UsersController')

    res.status(400).json({
      message: 'Something went wrong.',
    })
  }
}

const create = (req, res) => {
  // for (let step = 0; step < 5000; step++) {
  createUserWithEmailAndPassword(auth, req.body.email, req.body.password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user
      new User({
        uid: user.uid.toString(),
        email: req.body.email,
        full_name: req.body.full_name,
      }).save((error, user) => {
        if (error || !user) {
          console.log(error)
          res.status(500).send(error)
        } else {
          res.send({
            message: 'User created successfully',
            user: user,
          })
          console.log('success')
        }
      })
      // ...
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      // ..
    })
}
// Handle update user info
const update = (req, res) => {
  User.findById(req.params.user_id, (error, user) => {
    if (error) {
      console.log(error)
      res.status(500).send(error)
    } else if (user) {
      Object.keys(req.body).forEach((key) => {
        if (req.body) {
          user[key] = req.body[key]
        }
      })

      console.log(user)
      user.save((error, user) => {
        if (error || !user) {
          console.log(error)
          res.status(500).send(error)
        } else {
          res.send({
            message: 'User updated successfully',
            user: user,
          })
        }
      })
    } else {
      res.status(404).send({ message: 'User not found' })
    }
  })
}
// Handle delete user
const destroy = (req, res) => {
  User.remove({ _id: req.params.user_id }, (error) => {
    if (error) {
      console.log(error)
      res.status(500).send(error)
    } else {
      res.send({
        message: 'User deleted successfully',
      })
    }
  })
}

const getUserRegisteredEventIds = (req, res) => {
  User.findOne({ uid: req.params.user_id }, (error, user) => {
    if (error) {
      console.log(error)
      res.status(500).send(error)
    } else if (user) {
      res.send(user.registeredEventIds)
    } else {
      res.status(404).send({ message: `User not found` })
    }
  })
}

const registerNotificationToken = (req, res) => {
  User.findOne({ uid: req.params.user_id }, (error, user) => {
    if (error) {
      console.log(error)
      res.status(500).send(error)
    } else if (user) {
      user.notificationToken = req.body.notificationToken
      user.save()
      res.send({ message: 'Notification registered successfully' })
    } else {
      res.status(404).send({ message: `User not found` })
    }
  })
}

export default {
  findAll,
  findOne,
  create,
  update,
  destroy,
  login,
  register,
  verifyEmail,
  getDeveloperTitle,
  getUserRegisteredEventIds,
  registerNotificationToken,
}
