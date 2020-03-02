// lib dependency
const express = require('express')
const connectDb = require('./src/connection')
const api = require('./src/api')

// const
const app = express()
const PORT = 8000

app.use('/api', api)

app.listen(PORT, () => {
  console.log('Listening at ' + PORT)
})

connectDb()
