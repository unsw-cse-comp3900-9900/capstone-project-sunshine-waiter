const config = require('config')
const _ = require('lodash')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../models/user')
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  // validate input format
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  // validate user existence
  let user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send('User not exist!')
  // validate password
  const isPswValid = await bcrypt.compare(req.body.password, user.password)
  if (!isPswValid) return res.status(400).send('Invalid email or password')

  const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'))
  res.send(token)
})

function validate(user) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .email()
      .required(),
    password: Joi.string()
      .min(10)
      .max(255)
      .required(),
  }

  return Joi.validate(user, schema)
}

module.exports = router
