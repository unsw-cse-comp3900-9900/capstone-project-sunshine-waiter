const _ = require('lodash')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')

const { User } = require('../models/user')
const { generateAuthToken } = require('../controllers/userController')

const login = async (req, res) => {
  // validate input format
  const { email, password } = req.body
  const { error } = validateLoginDataFormat({ email, password })
  if (error) return res.status(400).send(error.details[0].message)

  // validate user existence
  let user = await User.findOne({ email: email })
  if (!user) return res.status(400).send('User not exist!')
  // validate password
  const isPswValid = await validatePassword(password, user.password)
  if (!isPswValid) return res.status(400).send('Invalid email or password')
  const token = generateAuthToken(user)

  res.send(token)
}

function validateLoginDataFormat(data) {
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

  return Joi.validate(data, schema)
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

const tokenVerification = async (req, res, next) => {
  // 1. if no token: next
  const token = req.header('x-auth-token')
  if (!token) next()

  try {
    const { _id: userId, exp } = jwt.verify(token, config.get('JWT_SECRET'))

    // 3.1 token expired
    if (exp < Date.now().valueOf() / 1000) {
      return res.status(401).json({
        error: 'JWT token has expired, please login to obtain a new one',
      })
    }

    // 2. token valid
    res.loggedInUser = await User.findById(userId)

    next()
  } catch (error) {
    // 3.2 token invalid
    res.status(400).send('Invalid token.')
  }
}

module.exports = { login, tokenVerification }