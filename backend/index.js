// lib dependency
const express = require('express')
const connectDb = require('./src/connection')

// const
const app = express()
const PORT = 8000

app.listen(PORT, () => {
  console.log('Listening at ' + PORT)
})

connectDb()
