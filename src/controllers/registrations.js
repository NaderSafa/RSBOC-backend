// import Event from "../models/event.js";
import User from '../models/dimensions/user.dim.model.js'
import Registration from '../models/registration.js'
import mongoose from 'mongoose'
import fs from 'fs'

const findAll = (req, res) => {
  Registration.find({ uid: req.params.user_id }, (error, registrations) => {
    if (error) {
      console.log(error)
      res.status(500).send(error)
    } else {
      res.send(registrations)
    }
  })
}

const getUserRegistrations = (req, res) => {
  User.findOne({ uid: req.params.user_id }, (err, user) => {
    if (err) {
      console.log(err)
    } else {
      user.registrations
        ? res.status(200).send(user.registrations)
        : res.status(404).send('Registrations not found')
    }
  })
}

const saveQRCodeToFS = (req, res) => {
  Registration.findByIdAndUpdate(
    req.params.registration_id,
    { base64QRCode: req.body.base64QRCode },
    { new: true },
    (err, registration) => {
      if (err) {
        console.log(err)
      } else {
        User.findOneAndUpdate({ uid: req.params.user_id }, {}, (err, user) => {
          if (err) {
            console.log(err)
          } else {
            user.registrations[user.registrations.length - 1] = registration
            user.save()
          }
        })
      }
    }
  )

  var base64Data = req.body.base64QRCode.replace(/^data:image\/png;base64,/, '')

  fs.writeFile(
    `qrcodes/${req.params.registration_id}.png`,
    base64Data,
    'base64',
    function (err) {
      console.log(err)
    }
  )
}

const addRegistration = (req, res) => {
  new Registration({
    ...req.body,
  }).save((error, registration) => {
    if (error || !registration) {
      console.log(error)
      res.status(500).send(error)
    } else {
      registration.event = req.body.event
      User.findOne({ uid: req.params.user_id }, (error, user) => {
        registration.user = {
          ...user,
        }
        registration.save()
        console.log(registration)
        if (error) {
          console.log(error)
          res.status(403).send(error)
        } else if (user) {
          // registration.base64QRCode &&
          //   saveQRCodeToFS(registration.base64QRCode, registration._id);
          user.registrations = [...user.registrations, registration]
          user.registeredEventIds.push(req.body.event._id.toString())
          user.save((error, user) => {
            if (error || !user) {
              console.log(error)
              res.status(400).send(error)
            } else {
              Event.findOne({ title: req.body.event.title }, (err, event) => {
                if (err) {
                  console.log(err)
                } else {
                  console.log('found event!')
                  event.totalRegisters = event.totalRegisters + 1
                  event.save((error, event) => {
                    if (error || !event) {
                      console.log(error)
                      res.status(400).send(error)
                    } else {
                      console.log('registration added!')
                      res.send({
                        message: 'Registration added successfully',
                        registration: registration,
                      })
                    }
                  })
                }
              })
            }
          })
        } else {
          res.status(404).send({ error: 'User not found' })
        }
      })
    }
  })
}

export default {
  findAll,
  addRegistration,
  saveQRCodeToFS,
  getUserRegistrations,
}
