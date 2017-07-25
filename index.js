'use strict'
const express = require('express'),
      app = express(),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      jwt = require('jsonwebtoken'),
      path = require('path')
//      sessions = required('client-sessions')

process.env.STUDENT_SECRET_KEY = ''
process.env.ADMIN_SECRET_KEY = ''
process.env.MONGODB_CONNECT = ''

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(express.static('dist'))
app.use('/dist', express.static('dist'))

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*')

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With')

    // Pass to next layer of middleware
    next()
})


app.get('/', (req, res) => {
  res.send('Welcome to Stretch.')
})


app.use(require('morgan')('dev'))

mongoose.connect(process.env.MONGODB_CONNECT, {
  useMongoClient: true,
  /* other options */
})

mongoose.Promise = require('bluebird')

//Get the default connection
let db = mongoose.connection

db.once('open', () => {
  console.log('Connected to mongoDB.')
})

db.on('error', (err) => {
  console.log(err)
})

//Admin routes
app.use('/v1/admin', require('./v1/admin/user_api'))
app.use('/v1/admin', require('./v1/admin/question_api'))
app.use('/v1/admin', require('./v1/admin/subject_api'))
app.use('/v1/admin', require('./v1/admin/tutor_api'))
app.use('/v1/admin', require('./v1/admin/notes_api'))

//Mobile routes
app.use('/v1/api', require('./v1/routes/student_api'))
app.use('/v1/api', require('./v1/routes/notes_api'))
app.use('/v1/api', require('./v1/routes/question_api'))
app.use('/v1/api', require('./v1/routes/subject_api'))
app.use('/v1/api', require('./v1/routes/tutors_api'))

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/admin.html'))
})

app.listen(process.env.PORT || 8080, () => {
  console.log('Application running now...')
})
