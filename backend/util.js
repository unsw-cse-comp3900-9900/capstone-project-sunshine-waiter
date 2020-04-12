const isValid = require('mongoose').Types.ObjectId.isValid
// present data to client side
const present = (obj) => {
  const { __v, createdBy, ...data } = obj._doc
  return data
}
const validateObjectId = (id) => {
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

module.exports = {
  present,
  validateObjectId,
  validateRole,
}
