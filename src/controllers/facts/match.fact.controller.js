import User from '../../models/dimensions/user.dim.model.js'
import Registration from '../../models/facts/registration.fact.model.js'
import Event from '../../models/bridges/event.bridge.model.js'
import Match from '../../models/facts/match.fact.model.js'

import { storage } from '../../../utils/firebaseInitialization.js'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'

// GET: return all users
const findAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 100
    const query = {}

    if (req.query.event) query.event = req.query.event
    if (req.query.group) query.group = req.query.group
    if (req.query.round) query.round = req.query.round

    const matches = await Match.find(
      query,
      {},
      {
        sort: {
          [req.query.sortByField ? req.query.sortByField : 'round']:
            req.query.sortByOrder || 1,
        },
        limit: limit,
        skip: (page - 1) * limit,
      }
    ).populate([
      { path: 'group', select: ['name'] },
      {
        path: 'registration1',
        select: ['players'],
        populate: {
          path: 'players',
          select: ['full_name', 'club'],
          populate: { path: 'club', select: 'image_url' },
        },
      },
      {
        path: 'registration2',
        select: ['players'],
        populate: {
          path: 'players',
          select: ['full_name', 'club'],
          populate: { path: 'club', select: 'image_url' },
        },
      },
    ])

    const totalCount = await Match.countDocuments(query)

    res.status(200).json({
      message: 'Fetched Matches',
      matches: matches,
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
    await req.body.players.forEach(async (player) => {
      const user = await User.findOne({ _id: player })
      console.log(user.registered_events[0].toString() === req.body.event)
      user.registered_events.forEach(async (event) => {
        if (event.toString() === req.body.event) {
          await res.status(400).json({
            message: `Player is already registered to this event`,
          })
          return
        }
      })
      if (user.registered_events.indexOf(req.body.event) !== -1) {
        console.log('dakhal')
        await res.status(400).json({
          message: `Player is already registered to this event`,
        })
        return
      } else {
        console.log('madakhalsh')
      }
    })

    // check if one of the players is already registered to this event
    // const registeredPlayers = await Registration.find(
    //   { event: req.body.event },
    //   { players: 1, _id: 0 }
    // )

    // let alreadyRegisteredPlayers = []
    // let alreadyRegisteredPlayer = {}

    // registeredPlayers.forEach((registration) =>
    //   registration.players.forEach((player) =>
    //     alreadyRegisteredPlayers.push(String(player))
    //   )
    // )

    // await req.body.players.forEach(async (player) => {
    //   if (alreadyRegisteredPlayers.indexOf(player) !== -1) {
    //     alreadyRegisteredPlayer = await User.findOne(
    //       { _id: player },
    //       { _id: 0, full_name: 1 }
    //     )
    //     res.status(400).json({
    //       message: `Player ${alreadyRegisteredPlayer.full_name} already registered to this event`,
    //     })
    //     return
    //   }
    // })

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

// Handle update match
const update = async (req, res) => {
  try {
    const match = await Match.findOne({
      _id: req.params.match_id,
    })

    if (!match) {
      res.status(404).json({
        message: 'Match not found!',
      })
      return
    }

    if (match.played === true) {
      res.status(400).json({
        message: "You can't update the data of already played match",
        sets: match.sets,
      })
      return
    }

    await Match.updateOne(
      {
        _id: req.params.match_id,
      },
      {
        $set: {
          sets: req.body.sets,
          played: req.body.played === true && true,
          updatedAt: Date.now(),
        },
      }
    )

    if (req.body.played === true) {
      const sets = [0, 0]

      for (const set of req.body.sets) {
        set.registration1_score > set.registration2_score
          ? (sets[0] = sets[0] + 1)
          : (sets[1] = sets[1] + 1)
      }

      await Registration.updateOne(
        { _id: match.registration1 },
        {
          $set: {
            updatedAt: Date.now(),
          },
          $inc: {
            sets_won: sets[0],
            sets_lost: sets[1],
            matches_won: sets[0] > sets[1] ? 1 : 0,
            matches_lost: sets[0] > sets[1] ? 0 : 1,
          },
        }
      )

      await Registration.updateOne(
        { _id: match.registration2 },
        {
          $set: {
            updatedAt: Date.now(),
          },
          $inc: {
            sets_won: sets[1],
            sets_lost: sets[0],
            matches_won: sets[0] > sets[1] ? 0 : 1,
            matches_lost: sets[0] > sets[1] ? 1 : 0,
          },
        }
      )
    }

    res.status(200).json({
      message: 'Match updated successfully!',
    })
  } catch (err) {
    console.log(err)
    console.log('Catch - update - MatchController')

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
