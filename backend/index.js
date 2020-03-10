// lib dependency
const express = require('express')
const connectDb = require('./src/connection')
const api = require('./src/api')
const users = require('./routes/users')

// const
const app = express()
const PORT = 8000

app.use(express.json())
app.use('/api', api)
app.use('/api/users', users)

app.listen(PORT, () => {
  console.log('Listening at ' + PORT)
})

connectDb()
