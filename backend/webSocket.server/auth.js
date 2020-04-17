const { accessControl: ac } = require('../auth/accessControl')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/user.model')
const Restaurant = require('../models/restaurant.model')
const { actions, resource: _resource } = require('../auth/authorization')

const isGranted = (userId, restaurant, action, resource) => {
  const userGroups = restaurant.userGroups

  for (let [roleType, userIdArray] of Object.entries(userGroups)) {
    if (
      userGroups.hasOwnProperty(roleType) && // skip inherited properties. e.g "$init"
      Array.isArray(userIdArray) &&
      userIdArray.includes(userId) && // current user has the role
      ac.can(roleType)[action + 'Own'](resource).granted // the role has the permission
    ) {
      return true
    }
  }
  return false
}

const canConnectToRestaurant = async (token, restaurantId) => {
  // validate user input
  try {
    const { _id: userId, exp } = jwt.verify(token, config.get('JWT_SECRET'))

    // 3.1 token expired
    if (exp < Date.now().valueOf() / 1000) {
      return null
    }

    // 2. token valid
    const user = await User.findById(userId)
    if (!user) return null

    const restaurant = await Restaurant.findById(restaurantId)
    if (!restaurant) return null

    const userGroups = restaurant.userGroups

    for (let [roleType, userIdArray] of Object.entries(userGroups)) {
      if (
        userGroups.hasOwnProperty(roleType) && // skip inherited properties. e.g "$init"
        Array.isArray(userIdArray) &&
        userIdArray.includes(userId) // current user has the role
      ) {
        return { userId, restaurant }
      }
    }
    return null
  } catch (error) {
    // 3.2 token invalid
    return null
  }
}

const canAccessCook = (userId, restaurant) =>
  isGranted(userId, restaurant, actions.update, _resource.cooking_queue)
const canAccessWaiter = (userId, restaurant) =>
  isGranted(userId, restaurant, actions.update, _resource.serving_queue)
const canAccessOrder = (userId, restaurant) =>
  isGranted(userId, restaurant, actions.update, _resource.order)

module.exports = {
  canConnectToRestaurant,
  canAccessCook,
  canAccessWaiter,
  canAccessOrder,
}
