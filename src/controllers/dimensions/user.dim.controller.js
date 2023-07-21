import User from '../../models/dimensions/user.dim.model.js'
import Developer from '../../models/developer.js'
import Attachment from '../../models/attachment.js'
import jwt from 'jsonwebtoken'
import mongodb from 'mongodb'
import multer from 'multer'

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth'

import jwtConfig from '../../../config/jwtConfig.js'
import { firebaseApp, storage } from '../../../utils/firebaseInitialization.js'
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from 'firebase/storage'
// import mailHtml from '../../assets/mail.html.js'
// import test from '../../utils/mailService.js'
// import { APP_URL } from '../../config/urls.js'

const auth = getAuth(firebaseApp)

// Setting up multer as a middleware to grab photo uploads
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
// const findAll = (req, res) => {
//   User.find({ role: 'player' }, (error, users) => {
//     if (error) {
//       console.log(error)
//       res.status(500).send(error)
//     } else {
//       console.log(req.params)
//       res.send({ message: 'Fetched Users', users: users })
//     }
//   })
// }

// GET: return all users
const findAll = (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const query = {}
    let projection = {
      full_name: 1,
      profile_picture_url: 1,
      weight: 1,
      height: 1,
      preferred_hand: 1,
      approved: 1,
      dob: 1,
      country: 1,
    }

    const userRole = req.currentUser.role

    if (req.query.verified) query.verified = parseInt(req.query.verified)
    if (req.query.approved) query.approved = parseInt(req.query.approved)
    if (req.query.role)
      query.role = userRole === 'player' ? 'player' : req.query.role
    if (req.query.preferred_hand)
      query.preferred_hand = req.query.preferred_hand
    if (req.query.gender) query.gender = req.query.gender
    if (req.query.event_id) {
      projection = { full_name: 1, profile_picture_url: 1 }
      query.registered_events = {
        $nin: req.query.event_id,
      }
      query._id = { $ne: req.currentUser.id }
    }

    User.find(
      query,
      projection,
      {
        sort: { [req.query.sortByField]: req.query.sortByOrder || 1 },
        limit: limit,
        skip: (page - 1) * limit,
      },
      async (err, users) => {
        if (err) {
          console.log(err)
          return
        }
        const totalCount = await User.countDocuments(query)

        res.status(200).json({
          message: 'Fetched users',
          users: users,
          totalCount: totalCount,
        })
      }
    )
  } catch (err) {
    console.log(err)
    console.log('Catch - findAll - UsersController')

    res.status(400).json({
      message: 'Something went wrong.',
    })
  }
}

const findOne = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.user_id,
    })

    if (!user) {
      res.status(400).json({
        message: 'User not found.',
      })
      return
    }
    res.status(200).json({
      message: 'Fetched user',
      user,
    })
  } catch (err) {
    console.log(err)
    console.log('Catch - findOne - UsersController')

    res.status(400).json({
      message: 'Something went wrong.',
    })
  }
}

// get user data
const getUserData = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.currentUser.email,
    })

    if (!user) {
      res.status(400).json({
        message: 'User not found.',
      })
      return
    }
    res.status(200).json({
      message: 'Fetched user',
      user,
    })
    console.log('step')
  } catch (err) {
    console.log(err)
    console.log('Catch - getUserData - UsersController')

    res.status(400).json({
      message: 'Something went wrong.',
    })
  }
}

// POST: Register and verify
const registerCombined = async (req, res) => {
  const { email, full_name, password } = req.body
  const user = await User.findOne({
    email,
  })
  if (user)
    return res.status(400).json({
      message: 'User already existed',
    })

  // create firebase user
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (fbUser) => {
      await User.create({
        uid: fbUser.user.uid,
        email,
        full_name,
      })

      await updateProfile(auth.currentUser, {
        displayName: full_name,
      })
        .then(() => {
          // Profile updated!
          console.log('profile updated')
          // ...
        })
        .catch((error) => {
          // An error occurred
          console.log(error)
        })

      await sendEmailVerification(auth.currentUser)
        .then(() => {
          console.log('Email sent to user for verification')
        })
        .catch((e) => {
          console.log('Error sending verification Email: ' + e)
          setError(e)
        })

      res.status(200).json({
        message: 'User created, please verify your email address!',
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
}

// POST: Register using email
// const register = async (req, res) => {
//   try {
//     const { email, full_name } = req.body
//     const user = await User.findOne({
//       email,
//     })
//     if (user)
//       return res.status(400).json({
//         message: 'User already existed',
//       })
//     const newUser = await User.create({
//       email,
//       full_name,
//     })

//     test.sendMail(
//       email,
//       'Verify your account.',
//       null,
//       mailHtml(
//         full_name,
//         `Follow the below link to verify your email address.
//         If you didn’t ask to verify this address, you can ignore this email.`,
//         'Verify your account',
//         email,
//         'Verify your account',
//         `${APP_URL}/create-password/?id=${newUser.id}`
//       )
//     )
//     res.status(200).json({
//       message: 'User created.',
//     })
//   } catch (err) {
//     console.log(err)
//     console.log('Catch - signup - UsersController')

//     res.status(400).json({
//       message: 'Something went wrong.',
//     })
//   }
// }

//POST: Verify email using email & password
// const verifyEmail = async (req, res) => {
//   try {
//     const { id, password } = req.body
//     const user = await User.findById(id)
//     if (!user)
//       return res.status(404).json({
//         message: 'User not found.',
//       })
//     createUserWithEmailAndPassword(auth, user.email, password)
//       .then(async (fbUser) => {
//         await User.updateOne(
//           {
//             _id: id,
//           },
//           {
//             $set: {
//               verified: true,
//               uid: fbUser.user.uid,
//             },
//           }
//         )

//         res.status(200).json({
//           message: 'User is verified.',
//         })
//       })
//       .catch((error) => {
//         let errorCode = error.code
//         let message
//         switch (errorCode) {
//           case 'auth/email-already-in-use':
//             message = 'Email already registered.'
//             break

//           case 'auth/invalid-email':
//             message = 'Invalid email.'
//             break

//           case 'auth/operation-not-allowed':
//             message = 'Email/password accounts are not enabled in firebase.'
//             break

//           case 'auth/weak-password':
//             message = 'Weak password.'
//             break
//         }

//         console.log(error)
//         return res.status(406).json({
//           message: message ? message : 'Something went wrong.',
//         })
//       })
//   } catch (err) {
//     console.log(err)
//     console.log('Catch - VerifyEmail - UsersController')

//     res.status(400).json({
//       message: 'Something went wrong.',
//     })
//   }
// }

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

        if (userCredential.user.emailVerified === true) {
          await User.updateOne(
            { uid: userCredential.user.uid },
            {
              $set: {
                verified: true,
              },
            }
          )
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
const update = async (req, res) => {
  // if (!req.body?.full_name && !req.body?.profile_picture_url) {
  //   res.status(400).json({
  //     message: 'Full Name is a required field',
  //   })
  //   return
  // }
  if (req.body?._id || req.body?.email || req.body?.uid) {
    res.status(400).json({
      message: 'These fields can not be updated',
    })
    return
  }
  if (req.body?.verified || req.body?.approved || req.body?.role) {
    res
      .status(403)
      .json({ message: "You don't have the authority to change these fields" })
    return
  }

  req.body = req.body?.dob
    ? { ...req.body, dob: new Date(req.body.dob).toISOString() }
    : req.body

  try {
    await User.updateOne(
      {
        _id: req.currentUser.id,
      },
      {
        $set: {
          ...req.body,
          updatedAt: Date.now(),
        },
      }
    )
    res.status(200).json({
      message: 'User updated successfully!',
    })
  } catch (err) {
    console.log(err)
    console.log('Catch - update - UsersController')

    res.status(400).json({
      message: 'Something went wrong.',
    })
  }
}

// const update = (req, res) => {
//   User.findById(req.params.user_id, (error, user) => {
//     if (error) {
//       console.log(error)
//       res.status(500).send(error)
//     } else if (user) {
//       Object.keys(req.body).forEach((key) => {
//         if (req.body) {
//           user[key] = req.body[key]
//         }
//       })

//       console.log(user)
//       user.save((error, user) => {
//         if (error || !user) {
//           console.log(error)
//           res.status(500).send(error)
//         } else {
//           res.send({
//             message: 'User updated successfully',
//             user: user,
//           })
//         }
//       })
//     } else {
//       res.status(404).send({ message: 'User not found' })
//     }
//   })
// }
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

const uploadProfilePicture = async (req, res) => {
  try {
    const dateTime = giveCurrentDateTime()
    const storageRef = ref(
      storage,
      `uploads/${req.currentUser.id + '       ' + dateTime}`
    )

    // Create file metadata including the content type
    const metadata = {
      contentType: req.file.mimetype,
    }

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    )
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref)

    console.log('File successfully uploaded.')
    return res.send({
      message: 'file uploaded to firebase storage',
      name: req.file.originalname,
      type: req.file.mimetype,
      downloadURL: downloadURL,
    })
  } catch (error) {
    return res.status(400).send(error.message)
  }
}

const giveCurrentDateTime = () => {
  const today = new Date()
  const date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
  const time =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
  const dateTime = date + ' ' + time
  return dateTime
}

const forgotPassword = async (req, res) => {
  await sendPasswordResetEmail(auth, req.body.email)
    .then(() => {
      // Password reset email sent!
      res.status(200).json({
        message: 'Password reset email sent, please check your inbox!',
      })
    })
    .catch((error) => {
      return res.status(400).send(error.message)

      // ..
    })
}

export default {
  findAll,
  findOne,
  create,
  update,
  destroy,
  login,
  // register,
  registerCombined,
  uploadProfilePicture,
  // verifyEmail,
  getUserData,
  getDeveloperTitle,
  getUserRegisteredEventIds,
  registerNotificationToken,
  forgotPassword,
}
