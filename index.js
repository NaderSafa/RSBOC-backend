import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import passport from 'passport'
import morgan from 'morgan'
import router from './src/router.js'
import dbConfig from './config/mongoDB.js'

// DB Setup
mongoose.connect(
  dbConfig.CONNECTION_STRING.replace('password', dbConfig.DB_PASSWORD),
  {
    autoIndex: true, //make this also true
  }
)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
  console.log('Connection Succeeded')
})

// Express Setup
const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'jade')
app.use('/api', router(express, passport))
app.use('/qrcodes', express.static('qrcodes'))

app.listen('8080' || process.env.PORT, () => {
  console.log(`Server running on port 8080`)
})
