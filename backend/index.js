// lib dependency
const config = require('config')
const express = require('express')
const connectDb = require('./db/connection')
const users = require('./routes/user.routes')
const restaurants = require('./routes/restaurant.routes')
const menus = require('./routes/menu.routes')
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
const PORT = 8000
const app = express()

app.set('json spaces', 2)
app.use(express.json())
app.use(cors())

// routes
app.use('/users', users)
app.use('/restaurants', restaurants)
app.use('/restaurants', menus)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log('Listening at ' + PORT)
})

connectDb()
