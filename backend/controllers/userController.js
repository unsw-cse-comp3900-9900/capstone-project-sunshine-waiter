const Joi = require('joi')
const bcrypt = require('bcrypt')
const { User } = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('config')
const _ = require('lodash')

const generateAuthToken = user => {
  const token = jwt.sign({ _id: user._id }, config.get('JWT_SECRET'), {
    expiresIn: '1d',
  })
  return token
}

// create user,
const createUser = async (req, res, next) => {
  try {
    const { error } = validateSignUpDataFormat(req.body)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }
    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('User already registered.')

    user = new User(_.pick(req.body, ['name', 'email', 'password']))
    user.password = await hashPassword(user.password)

    await user.save()

    const accessToken = generateAuthToken(user)

    res.json({
      data: _.pick(user, ['_id', 'name', 'email']),
      accessToken,
    })
  } catch (error) {
    next(error)
  }
}

function validateSignUpDataFormat(user) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .email()
      .required(),
    password: Joi.string()
      .min(10)
      .max(255) // unhashed password, the one user inputs
      .required(),
  }

  return Joi.validate(user, schema)
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

readUser = async (req, res, next) => {
  try {
    const userId = req.params.userId
    const user = await User.findById(userId)
    if (!user) return next(new Error('User does not exist'))

    res.json({
      data: _.pick(user, ['_id', 'name', 'email']),
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  generateAuthToken,
  createUser, // aka signup
  readUser,
}
