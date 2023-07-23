import Country from '../../models/lookups/country.lookup.model.js'
import Club from '../../models/lookups/club.lookup.model.js'

import mongodb from 'mongodb'

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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

// Handle index actions
const findAll = (req, res) => {
  Club.find({}, {}, (error, clubs) => {
    if (error) {
      console.log(error)
      res.status(500).send(error)
    } else {
      res.send({ message: 'Fetched Clubs', clubs: clubs })
    }
  })
}

const findOne = async (req, res) => {
  try {
    const club = await Club.findOne({
      _id: req.params.club_id,
    })

    if (!club) {
      res.status(404).json({
        message: 'Club not found.',
      })
      return
    }
    res.status(200).json({
      message: 'Fetched Club',
      club,
    })
    console.log('step')
  } catch (err) {
    console.log(err)
    console.log('Catch - findOne - ClubsController')

    res.status(400).json({
      message: 'Something went wrong.',
    })
  }
}

const create = (req, res) => {
  req.body.forEach((i) => {
    new Club({
      ...i,
    }).save((error, club) => {
      if (error || !club) {
        console.log(error)
        res.status(500).send(error)
      } else {
        console.log('success')
      }
    })
  })

  res.send({
    message: 'clubs added successfully',
  })
  // new Country({
  //   ...req.body,
  // }).save((error, country) => {
  //   if (error || !country) {
  //     console.log(error)
  //     res.status(500).send(error)
  //   } else {
  //     res.send({
  //       message: 'country added successfully',
  //       country: country,
  //     })
  //     console.log('success')
  //   }
  // })
}

// Handle update country info
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

export default {
  findAll,
  findOne,
  create,
  update,
  destroy,
}
