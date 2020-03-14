const _ = require('lodash')
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcrypt')
const { User, validate } = require('../models/user')
const express = require('express')
const router = express.Router()

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword)
}
router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }
  let user = await User.findOne({ email: req.body.email })
  if (user) return res.status(400).send('User already registered.')

  user = new User(_.pick(req.body, ['name', 'email', 'password']))
  user.password = await hashPassword(user.password)

  await user.save()

  const token = user.generateAuthToken()

  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']))
})

module.exports = router
