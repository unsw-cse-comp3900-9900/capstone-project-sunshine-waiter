const mongoose = require('mongoose')

// present data to client side
const present = (obj) => {
  const { __v, ...data } = obj._doc
  return data
}

const validateObjectId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid
  if (!isValid(id))
    throw { httpCode: 404, message: `ObjectId "${id}" is not valid.` }
}

const { roles, isValidRole } = require('./auth/authorization')
validateRole = (role) => {
  if (!isValidRole(role) || role === roles.owner)
    throw {
      httpCode: 400,
      message: `${role} is not a valid role.`,
    }
}

const performTransaction = async (executable) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    await executable()

    await session.commitTransaction()
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

module.exports = {
  present,
  validateObjectId,
  validateRole,
  performTransaction,
}
