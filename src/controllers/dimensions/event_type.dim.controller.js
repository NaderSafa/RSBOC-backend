import EventType from '../../models/dimensions/event_type.dim.model.js'

// Handle index actions
const findAll = (req, res) => {
  EventType.find({}, {}, (error, eventTypes) => {
    if (error) {
      console.log(error)
      res.status(500).send(error)
    } else {
      res.send({
        message: 'Fetched Event Types',
        eventTypes,
      })
    }
  })
}

const findOne = async (req, res) => {
  try {
    const eventType = await EventType.findOne({
      _id: req.params.event_type_id,
    })

    if (!eventType) {
      res.status(400).json({
        message: 'eventType not found.',
      })
      return
    }
    res.status(200).json({
      message: 'Fetched Event Type',
      eventType,
    })
  } catch (err) {
    console.log(err)
    console.log('Catch - findOne - eventType_dimController')

    res.status(400).json({
      message: 'Something went wrong.',
    })
  }
}

const create = (req, res) => {
  let code
  if (req.body.time_based === false) {
    code = 'M'
    switch (req.body.head) {
      case 'singles':
        code += 'S1-'
        break
      case 'doubles':
        code += 'D2-'
        break
      case 'singles teams':
        code += 'T4-'
        break

      default:
        break
    }
  }
  code += req.body.best_of.toString()
  code += req.body.points_per_set.toString().padStart(2, '0')
  code += req.body.tie_breaks.toString() + '-'

  console.log(code)
  new EventType({
    ...req.body,
  }).save((error, eventType) => {
    if (error || !eventType) {
      console.log(error)
      res.status(500).send(error)
    } else {
      res.send({
        message: 'event type added successfully!',
        eventType,
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
