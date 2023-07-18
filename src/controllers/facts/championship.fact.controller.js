import ChampionshipFact from '../../models/facts/championship.fact.model.js'

import mongodb from 'mongodb'

// Handle index actions
const findAll = (req, res) => {
  ChampionshipFact.find({}, {}, (error, championships) => {
    if (error) {
      console.log(error)
      res.status(500).send(error)
    } else {
      res.send({
        message: 'Fetched Championships',
        championships,
      })
    }
  })
}

const findOne = async (req, res) => {
  try {
    const championship = await ChampionshipFact.findOne({
      _id: req.params.championship_fact_id,
    })

    if (!championship) {
      res.status(400).json({
        message: 'championship not found.',
      })
      return
    }
    res.status(200).json({
      message: 'Fetched Championship',
      championship,
    })
  } catch (err) {
    console.log(err)
    console.log('Catch - findOne - championship_lookupController')

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
  new ChampionshipFact({
    ...req.body,
  }).save((error, championship) => {
    if (error || !championship) {
      console.log(error)
      res.status(500).send(error)
    } else {
      res.send({
        message: 'Championship added successfully!',
        championship,
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
