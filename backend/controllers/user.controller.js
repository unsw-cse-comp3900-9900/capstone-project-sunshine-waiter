const Joi = require('joi')
const User = require('../models/user.model')
const {
  generateAuthToken,
  generateHashedPassword,
} = require('../auth/authentication')
const _ = require('lodash')

// Route Handlers

// create user,
createUser = async (req, res, next) => {
  try {
    await validateOnCreateUser(req.body)

    user = await dbCreateUser(req.body)

    res.status(201).json({
      data: _.pick(user, ['_id', 'name', 'email']),
      accessToken: generateAuthToken(user),
    })
  } catch (error) {
    next(error)
  }
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
    const { error } = validateUpdateDataFormat(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    // update
    await dbUpdateUser(req.body, user)

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

async function dbUpdateUser(data, user) {
  const { name, password } = data
  user.name = name || user.name
  user.password = password
    ? await generateHashedPassword(password)
    : user.password
  await user.save()
}

// Util functions
function validateUpdateDataFormat(user) {
  const schema = {
    name: Joi.string().min(1).max(50),
    email: Joi.string().min(1).max(255).email(),
    password: Joi.string().min(10).max(255), // unhashed password, the one user inputs
  }

  return Joi.validate(user, schema)
}

/*
if invalid: throw { message, httpCode }
if valid: do nothing
*/
const validateOnCreateUser = async (data) => {
  const schema = {
    name: Joi.string().min(1).max(50).required(),
    email: Joi.string().min(1).max(255).email().required(),
    password: Joi.string().min(10).max(255).required(),
  }

  const { error } = Joi.validate(data, schema)
  if (error) throw { message: error.details[0].message, httpCode: 400 }

  let existingUser = await User.findOne({ email: data.email })
  if (existingUser) throw { message: 'User already registered.', httpCode: 400 }
}

const dbCreateUser = async (data) => {
  const { name, email, password: plainPassword } = data
  const password = await generateHashedPassword(plainPassword)
  const user = new User({ name, email, password })
  await user.save()
  return user
}

module.exports = {
  // route handlers
  createUser, // aka signup
  readUser,
  updateUser,
  deleteUser,

  // Util functions interact with DB
  dbCreateUser,
}
