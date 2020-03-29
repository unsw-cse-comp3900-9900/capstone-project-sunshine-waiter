const Joi = require('joi')
const bcrypt = require('bcrypt')
const User = require('../models/user.model')
const { generateAuthToken } = require('../auth/authentication')
const _ = require('lodash')

// create user,
const createUser = async (req, res, next) => {
  try {
    const { error } = validateSignUpDataFormat(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }
    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).json({ error: 'User already registered.' })

    user = new User(_.pick(req.body, ['name', 'email', 'password']))
    user.password = await hashPassword(user.password)

    await user.save()

    const accessToken = generateAuthToken(user)

    res.status(201).json({
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
    if (!user) return res.status(404).json({ error: 'User does not exist' })

    res.json({
      data: _.pick(user, ['_id', 'name', 'email']),
    })
  } catch (error) {
    next(error)
  }
}

updateUser = async (req, res, next) => {
  try {
    // find
    const userId = req.params.userId
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ error: 'User does not exist' })

    // validate new data
    const { name, password } = req.body
    const { error } = validateUpdateDataFormat({ name, password })
    if (error) return res.status(400).json({ error: error.details[0].message })

    // update
    user.name = name || user.name
    user.password = password ? await hashPassword(password) : user.password
    await user.save()

    // res
    return res.json({
      success: true,
      data: _.pick(user, ['_id', 'name', 'email']),
      message: 'User updated.',
    })
  } catch (error) {
    next(error)
  }
}

deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId
    const user = await User.findById(userId)
    if (!user)
      return res
        .status(204)
        .send('User has been deleted or does not exist at all.')

    await User.findByIdAndDelete(userId)

    return res.json({
      success: true,
      data: _.pick(user, ['_id', 'name', 'email']),
      message: 'User deleted.',
    })
  } catch (error) {
    next(error)
  }
}

function validateUpdateDataFormat(user) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50),
    email: Joi.string()
      .min(5)
      .max(255)
      .email(),
    password: Joi.string()
      .min(10)
      .max(255), // unhashed password, the one user inputs
  }

  return Joi.validate(user, schema)
}

module.exports = {
  createUser, // aka signup
  readUser,
  updateUser,
  deleteUser,
}
