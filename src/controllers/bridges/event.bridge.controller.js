import Event from '../../models/bridges/event.bridge.model.js'
import Tournament from '../../models/facts/tournament.fact.model.js'
import Championship from '../../models/dimensions/championship.dim.model.js'
import EventType from '../../models/dimensions/event_type.dim.model.js'
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

    const testing = await Event.aggregate([
      {
        $lookup: {
          from: 'tournaments',
          localField: 'tournament_id',
          foreignField: '_id',
          as: 'testt',
        },
      },
    ])

    const x = await Event.findOne({
      _id: req.params.event_id,
    }).populate('tournament_id')

    res.status(200).json({
      message: 'Fetched Event',
      testing,
      x,
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

const getEventDetails = async (req, res) => {
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

    const tournament = await Tournament.findById(event.tournament_id)

    const championship = await Championship.findById(tournament.championship_id)

    const eventType = await EventType.findById(event.event_type_id)
    res.status(200).json({
      message: 'Fetched Event',
      event,
      tournament,
      championship,
      eventType,
    })
  } catch (err) {
    console.log(err)
    console.log('Catch - findOne - EventBridgeController')

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
