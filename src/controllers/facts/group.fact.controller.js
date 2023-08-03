import User from '../../models/dimensions/user.dim.model.js'
import Registration from '../../models/facts/registration.fact.model.js'
import Group from '../../models/facts/group.fact.model.js'
import Match from '../../models/facts/match.fact.model.js'
import Event from '../../models/bridges/event.bridge.model.js'

import { storage } from '../../../utils/firebaseInitialization.js'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { ObjectId } from 'mongodb'
import { generateMatches } from '../../../utils/generateMatches.js'

// GET: return all users
const findAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 100
    const query = {}

    if (req.query.event) query.event = req.query.event

    const groups = await Group.find(
      query,
      {},
      {
        sort: { [req.query.sortByField]: req.query.sortByOrder || 1 },
        limit: limit,
        skip: (page - 1) * limit,
      }
    )

    const totalCount = await Group.countDocuments(query)

    res.status(200).json({
      message: 'Fetched Groups',
      groups: groups,
      totalCount: totalCount,
    })
  } catch (err) {
    console.log(err)
    console.log('Catch - findAll - GroupController')

    res.status(400).json({
      message: 'Something went wrong.',
    })
  }
}

const findOne = async (req, res) => {
  try {
    const group = await Group.findOne({
      _id: req.params.group_id,
    }).populate({
      path: 'registrations',
      select: ['players', 'club'],
      populate: {
        path: 'players',
        select: ['full_name', 'club'],
        populate: { path: 'club', select: 'image_url' },
      },
    })

    if (!group) {
      res.status(400).json({
        message: 'Group not found.',
      })
      return
    }
    res.status(200).json({
      message: 'Fetched Group',
      group,
    })
  } catch (err) {
    console.log(err)
    console.log('Catch - findOne - GroupController')

    res.status(400).json({
      message: 'Something went wrong.',
    })
  }
}

const create = async (req, res) => {
  try {
    const { registrations, eventId } = req.body.params

    const nGroups = await Group.countDocuments({ event: eventId })
    let asciiCode = 'A'.charCodeAt(0)
    asciiCode += nGroups
    const groupName = String.fromCharCode(asciiCode)

    new Group({
      registrations: registrations,
      event: eventId,
      name: groupName,
    }).save(async (error, group) => {
      if (error || !group) {
        console.log(error)
        res.status(500).send(error)
      } else {
        await Event.updateOne(
          { _id: eventId },
          { $push: { groups: group._id } }
        )

        registrations.forEach(async (registration) => {
          await Registration.updateOne(
            { _id: registration },
            {
              $set: {
                group: group._id,
              },
            }
          )
        })

        const matches = generateMatches(registrations.length, registrations)

        for (let round = 0; round < matches.length; round++) {
          for (let match = 0; match < matches[round].length; match++) {
            new Match({
              event: eventId,
              group: group._id,
              round: round + 1,
              registration1: matches[round][match][0],
              registration2: matches[round][match][1],
            }).save(async (error, match) => {
              if (error || !match) {
                console.log(error)
                res.status(500).send(error)
              } else {
                await Group.updateOne(
                  { _id: group._id },
                  { $push: { matches: match._id } }
                )
              }
            })
          }
        }
        res.status(200).send({
          message: 'group added successfully!',
        })
        console.log('success')
      }
    })
  } catch (err) {
    console.log(err)
    console.log('Catch - create - GroupController')
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
    console.log('Catch - update - GroupController')

    res.status(400).json({
      message: 'Something went wrong.',
    })
  }
}

// Handle delete user
const destroy = async (req, res) => {
  try {
    if (!req.query.event) {
      res.status(400).send({
        message: 'Please provide event param',
        query: req.query,
      })
      return
    }
    await Group.deleteOne({ _id: req.params.group_id })
    console.log('Group Deleted')

    await Registration.updateMany(
      { group: req.params.group_id },
      { $unset: { group: '' } }
    )
    console.log('Registration Updated')

    await Match.deleteMany({ group: req.params.group_id })
    console.log('matches deleted')

    await Event.updateOne(
      { _id: req.query.event },
      { $pull: { groups: req.params.group_id } }
    )
    console.log('event updated')

    res.status(200).send({
      message: 'Group deleted successfully',
    })
  } catch (err) {
    console.log(err)
    console.log('Catch - destroy - GroupController')

    res.status(400).json({
      message: 'Something went wrong.',
    })
  }
}

export default {
  findAll,
  findOne,
  create,
  update,
  destroy,
}
