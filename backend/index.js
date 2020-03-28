// lib dependency
const config = require('config')
const express = require('express')
const connectDb = require('./db/connection')
const users = require('./routes/user.routes')
const restaurants = require('./routes/restaurant.routes')
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')

// check environment variables
if (!config.get('JWT_SECRET')) {
  console.error(
    'FATAL ERROR: environment variable "jwtPrivatKey" is not defined. Go check README.md on .env_file'
  )
  process.exit(1)
}

// const
const PORT_MAIN = 7000
const PORT_WEBSOCKET = 5000

const app = express()
app.set('json spaces', 2)
app.use(express.json())
app.use(cors())

// routes
app.use('/users', users)
app.use('/restaurants', restaurants)

app.use(errorHandler)

app.listen(PORT_MAIN, () => {
  console.log('Node RESTful API listening at ' + PORT_MAIN)
})

// websocket
const app2 = require('express')()
const connectionHandler = require('./server')
const http = require('http').Server(app2)
const io = require('socket.io')(http)
var nsps = {}

io.on('connect', connectionHandler(nsps, io))

http.listen(PORT_WEBSOCKET, function () {
  console.log('Websocket listening at ' + PORT_WEBSOCKET)
})

connectDb()
