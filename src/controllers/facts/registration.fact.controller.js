import User from '../../models/dimensions/user.dim.model.js'
import Registration from '../../models/facts/registration.fact.model.js'
import Event from '../../models/bridges/event.bridge.model.js'

import { storage } from '../../../utils/firebaseInitialization.js'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'

// GET: return all users
const findAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 100
    const query = {}

    if (req.query.event) query.event = req.query.event
    if (req.query.approved) query.approved = req.query.approved
    if (req.query.group) query.group = { $exists: false }

    const registrations = await Registration.find(
      query,
      {},
      {
        sort: {
          [req.query.sortByField ? req.query.sortByField : 'points']:
            req.query.sortByOrder || -1,
        },
        limit: limit,
        skip: (page - 1) * limit,
      }
    ).populate({
      path: 'players',
      select: ['full_name', 'club'],
      populate: { path: 'club', select: 'image_url' },
    })

    const totalCount = await Registration.countDocuments(query)

    res.status(200).json({
      message: 'Fetched Registrations',
      registrations: registrations,
      totalCount: totalCount,
    })
  } catch (err) {
    console.log(err)
    console.log('Catch - findAll - RegistrationController')

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
    console.log('Catch - findOne - RegistrationController')

    res.status(400).json({
      message: 'Something went wrong.',
    })
  }
}

const create = async (req, res) => {
  try {
    // helping function
    const findGenders = async (players) => {
      let genders = []
      for (const player of players) {
        const user = await User.findOne({ _id: player }, { gender: 1 })
        genders.push(user.gender)
      }
      return genders
    }

    // helping function
    const countAppearances = (givenValue, array) => {
      let count = 0
      for (const value of array) {
        value === givenValue && count++
      }
      return count
    }

    // get registered event details
    const event = await Event.findOne(
      { _id: req.body.event },
      { event_type: 1, gender: 1 }
    ).populate({ path: 'event_type', select: 'players_per_team' })

    // ERROR HANDLING
    // checks if no. of registered player is right
    if (req.body.players.length !== event.event_type.players_per_team) {
      res.status(400).json({
        message: `This event requires ${event.event_type.players_per_team} player(s)`,
      })
      return
    }

    // check if genders of registered players is right
    const genders = await findGenders(req.body.players)

    if (event.gender === 'male' && genders.indexOf('F') !== -1) {
      res.status(400).json({
        message: `This event requires ${event.event_type.players_per_team} ${event.gender} player(s)`,
      })
      return
    } else if (event.gender === 'female' && genders.indexOf('M') !== -1) {
      res.status(400).json({
        message: `This event requires ${event.event_type.players_per_team} ${event.gender} player(s)`,
      })
      return
    } else if (
      event.gender === 'mixed' &&
      countAppearances('M', genders) !== countAppearances('F', genders)
    ) {
      res.status(400).json({
        message: `This event requires ${
          event.event_type.players_per_team / 2
        } male player(s) and ${
          event.event_type.players_per_team / 2
        } female player(s)`,
      })
      return
    }

    // check if one of the players is already registered to this event
    let isPlayerRegistered = false
    for (const player of req.body.players) {
      const user = await User.findOne({ _id: player })

      for (const objectId of user.registered_events) {
        if (objectId.toString() === req.body.event[0]) {
          isPlayerRegistered = true
          break
        }
      }

      if (isPlayerRegistered === true) {
        res.status(400).send({
          message: `Player is already registered to this event`,
        })
        return
      }
    }

    new Registration({
      ...req.body,
    }).save(async (error, registration) => {
      if (error || !registration) {
        console.log(error)
        res.status(500).send(error)
      } else {
        req.body.players.forEach(async (player) => {
          await User.updateOne(
            { _id: player },
            {
              $push: {
                registrations: registration._id,
                registered_events: event._id,
              },
            }
          )
        })

        await Event.updateOne(
          { _id: req.body.event },
          { $push: { registrations: registration._id } }
        )

        res.status(200).send({
          message: 'Registration added successfully!',
          registration,
        })
        console.log('success')
      }
    })
  } catch (err) {
    console.log(err)
    console.log('Catch - create - RegistrationController')
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
    console.log('Catch - getUserData - RegistrationController')

    res.status(400).json({
      message: 'Something went wrong.',
    })
  }
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
    console.log('Catch - update - RegistrationController')

    res.status(400).json({
      message: 'Something went wrong.',
    })
  }
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

const uploadRegistrationSS = async (req, res) => {
  try {
    const dateTime = giveCurrentDateTime()
    const storageRef = ref(
      storage,
      `registrations/${req.currentUser.id} ${dateTime}`
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

export default {
  findAll,
  findOne,
  create,
  update,
  destroy,
  uploadRegistrationSS,
  getUserData,
}
