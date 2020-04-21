const Joi = require('joi')
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
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
      data: present(user),
      accessToken: generateAuthToken(user),
    })
  } catch (error) {
    next(error)
  }
}

readById = async (req, res, next) => {
  try {
    const userId = req.params.userId
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ error: 'User does not exist' })

    res.json({
      data: present(user),
    })
  } catch (error) {
    next(error)
  }
}
readMe = async (req, res, next) => {
  try {
    const { user } = req
    if (!user)
      throw {
        httpCode: 400,
        message: 'User must login!',
      }

    res.json({ data: present(user) })
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
      data: present(user),
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
      data: present(user),
      message: 'User deleted.',
    })
  } catch (error) {
    next(error)
  }
}

uploadImage = async (req, res, next) => {
  try {
    // 0 - validate input
    const id = req.params.userId
    const file = req.file
    if (!file) throw { httpCode: 400, message: `Image file is required.` }
    const obj = await User.findById(id)
    if (!obj)
      throw { httpCode: 404, message: `Target user not found. Id: ${id}` }
    if (!obj._id.equals(req.user._id))
      throw {
        httpCode: 401,
        message: `Currently, user can only update own image.`,
      }

    // 1 - save newImg  remove oldImage from disk if any;
    const { path: oldImagePath } = obj.img
    const newImg = {
      contentType: file.mimetype,
      originalname: file.originalname,
      path: file.path,
    }
    obj.img = newImg
    await obj.save()

    if (oldImagePath) await diskDeleteFileByPath(oldImagePath)

    // 2 - reply with presentable image
    res.json({
      data: presentUserImg(obj),
      message: 'Successfully upload iamge. May have replaced old image if any.',
    })
  } catch (error) {
    next(error)
  }
}

readImage = async (req, res, next) => {
  try {
    const { userId: id } = req.params
    const obj = await User.findById(id)
    if (!obj)
      throw { httpCode: 404, message: `Target obj not found. Id: ${id}` }

    const { path } = obj.img
    if (!path)
      throw {
        httpCode: 404,
        message: `For obj ${id}, img not found.`,
      }

    res.sendFile(path, (Headers = { contentType: obj.img.contentType }))
  } catch (error) {
    next(error)
  }
}

deleteImage = async (req, res, next) => {
  try {
    // 0 validate input
    const { userId: id } = req.params
    const obj = await User.findById(id)
    if (!obj)
      throw { httpCode: 404, message: `Target obj not found. Id: ${id}` }
    if (!obj._id.equals(req.user._id))
      throw {
        httpCode: 401,
        message: `Currently, user can only modify own image.`,
      }

    // 1 - delete current img
    const { path } = obj.img
    if (!path)
      throw {
        httpCode: 404,
        message: `For obj ${id}, img not found.`,
      }

    obj.img = undefined
    await obj.save()
    console.log(path)
    await diskDeleteFileByPath(path)

    // 2 - reply with presentable image
    res.json({ message: 'Successfully delete iamge.' })
  } catch (error) {
    next(error)
  }
}

// Util functions
present = user => {
  const presentableUser = _.omit(user, ['isAdmin', 'password'])

  if (presentableUser.img) presentableUser.img = presentUserImg(presentableUser)
  return presentableUser
}

presentUserImg = obj => ({
  relativePath: `/users/${obj._id}/img`,
  contentType: obj.img.contentType,
  originalname: obj.img.originalname,
})

diskDeleteFileByPath = async (path) => {
  const err = await unlinkAsync(path)
  if (err)
    throw {
      httpCode: 400,
      message: `fs failed to delete file. It may have been deleted before.`,
      error: err,
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

const findByEmail = async (email) => {
  const { error } = Joi.validate(
    { email },
    {
      email: Joi.string().min(1).max(255).email(),
    }
  )
  if (error) throw { message: error.details[0].message, httpCode: 400 }

  const user = await User.findOne({ email })
  if (!user)
    throw {
      message: `user with email ${email} not found`,
      httpCode: 404,
    }
  return user
}

readCollection = async (req, res, next) => res.json(await User.find())

module.exports = {
  // route handlers
  createUser, // aka signup
  readById,
  readMe,
  updateUser,
  deleteUser,
  uploadImage,
  readImage,
  deleteImage,

  readCollection,
  // Util functions interact with DB
  dbCreateUser,
  findByEmail,
}
