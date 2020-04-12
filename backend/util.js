// present data to client side
const present = (obj) => {
  const { __v, createdBy, ...data } = obj._doc
  return data
}
const isValidObjectId = require('mongoose').Types.ObjectId.isValid
module.exports = {
  present,
  isValidObjectId,
}
