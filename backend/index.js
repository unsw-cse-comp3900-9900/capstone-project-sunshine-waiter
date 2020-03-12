// lib dependency
const config = require('config')
const express = require('express')
const connectDb = require('./src/connection')
const api = require('./src/api')
const users = require('./routes/users')
const auth = require('./routes/auth')

// const
const app = express()
const PORT = 8000

// environment variables
if (!config.get('jwtPrivatKey')) {
  console.error(
    'FATAL ERROR: environment variable "jwtPrivatKey" is not defined.'
  )
  process.exit(1)
}

app.use(express.json())
app.use('/api', api)
app.use('/api/users', users)
app.use('/api/auth', auth)

app.listen(PORT, () => {
  console.log('Listening at ' + PORT)
})

connectDb()
