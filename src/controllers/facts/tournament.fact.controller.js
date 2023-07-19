import Tournament from '../../models/facts/tournament.fact.model.js'

import mongodb from 'mongodb'

// Handle index actions
const findAll = (req, res) => {
  Tournament.find({}, {}, (error, tournaments) => {
    if (error) {
      console.log(error)
      res.status(500).send(error)
    } else {
      res.send({
        message: 'Fetched Tournaments',
        tournaments,
      })
    }
  })
}

const findOne = async (req, res) => {
  try {
    const tournament = await Tournament.findOne({
      _id: req.params.tournament_id,
    })

    if (!tournament) {
      res.status(400).json({
        message: 'tournament not found.',
      })
      return
    }
    res.status(200).json({
      message: 'Fetched Tournament',
      tournament,
    })
  } catch (err) {
    console.log(err)
    console.log('Catch - findOne - Tournament Controller')

    res.status(400).json({
      message: 'Something went wrong.',
    })
  }
}

const create = (req, res) => {
  // req.body.forEach((i) => {
  //   new Country({
  //     ...i,
  //   }).save((error, country) => {
  //     if (error || !country) {
  //       console.log(error)
  //       res.status(500).send(error)
  //     } else {
  //       console.log('success')
  //     }
  //   })
  // })

  // res.send({
  //   message: 'countries added successfully',
  // })
  new Tournament({
    ...req.body,
  }).save((error, tournament) => {
    if (error || !tournament) {
      console.log(error)
      res.status(500).send(error)
    } else {
      res.send({
        message: 'Tournament added successfully!',
        tournament,
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
