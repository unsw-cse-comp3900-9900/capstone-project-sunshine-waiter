const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()

// An example schema
const testObjSchema = new mongoose.Schema({
  text: String,
})
// An example model class
const TestObj = mongoose.model('TestObj', testObjSchema)

router.get('/', (req, res) => {
  res.send('hello to api page')
})

router.post('/test', (req, res) => {
  const newTestObj = new TestObj()
  newTestObj.text = 'hello test'
  newTestObj.save()
  res.status(201).send({ _id: newTestObj._id })
})

router.get('/test', (req, res) => {
  TestObj.find()
    .limit(10)
    .sort({ _id: 1 })
    .then(posts => res.json(posts))
})

module.exports = router
