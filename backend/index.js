// lib dependency
const config = require('config')
const express = require('express')
const connectDb = require('./src/connection')
const users = require('./routes/users')

// const
const app = express()
const PORT = 8000

// environment variables
if (!config.get('JWT_SECRET')) {
  console.error(
    'FATAL ERROR: environment variable "jwtPrivatKey" is not defined.'
  )
  process.exit(1)
}

app.use(express.json())

app.use('/users', users)

app.listen(PORT, () => {
  console.log('Listening at ' + PORT)
})

connectDb()
