import Event from '../../models/bridges/event.bridge.model.js'

// Handle index actions
const findAll = (req, res) => {
  Event.find({}, {}, (error, events) => {
    if (error) {
      console.log(error)
      res.status(500).send(error)
    } else {
      res.send({
        message: 'Fetched Events',
        events,
      })
    }
  })
}

const findOne = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.event_id,
    })

    if (!event) {
      res.status(400).json({
        message: 'Event not found.',
      })
      return
    }
    res.status(200).json({
      message: 'Fetched Event',
      event,
    })
  } catch (err) {
    console.log(err)
    console.log('Catch - findOne - EventBridgeController')

    res.status(400).json({
      message: 'Something went wrong.',
    })
  }
}

const create = (req, res) => {
  new Event({
    ...req.body,
  }).save((error, event) => {
    if (error || !event) {
      console.log(error)
      res.status(500).send(error)
    } else {
      res.send({
        message: 'event added successfully!',
        event,
      })
      console.log('success')
    }
  })
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