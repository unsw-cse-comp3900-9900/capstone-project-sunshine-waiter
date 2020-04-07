// present data to client side
const present = (obj) => {
  const { __v, createdBy, ...data } = obj._doc
  return data
}
module.exports = {
  present,
}
