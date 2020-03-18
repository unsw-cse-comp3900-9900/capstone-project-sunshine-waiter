const { accessControl: ac } = require('./accessControl')
const Restaurant = require('../models/restaurant')

const scopes = Object.freeze({ administration: 1, restaurant: 2 })
const roles = Object.freeze({
  // administration
  admin: 'admin',
  basic: 'basic',

  // restaurant
  manager: 'manager',
  cashier: 'cashier',
  cook: 'cook',
  waiter: 'waiter',
  customer: 'customer',
})

const allowIfLoggedin = async (req, res, next) => {
  const user = res.loggedInUser
  if (!user) {
    return res.status(401).json({
      error: 'Access denied. Require user logged in to access this route',
    })
  }
  req.user = user
  next()
}

// administration
const requestAccess = function(scope, action, resource) {
  scope.administration
  if (scope === scopes.administration) {
    return requestAccessOnUser(action, resource)
  }
  if (scope === scopes.restaurant) {
    return requestAccessOnRestaurant(action, resource)
  }
}

/*
pre-cond: 
  1. target userId: req.params.userId;
  2. verified loginedUser: req.user 
post-cond
  1. if user has permission on [target user : target resource]: pass to next() 
  2. else: 401 
*/
const requestAccessOnUser = function(action, resource) {
  return async (req, res, next) => {
    try {
      // 1. check pre-cond
      const userId = req.params
      const { user } = req
      if (!restaurantId || !user) {
        return res.status(500).json({
          error: 'Precond not satisfied! userId or req.user not exist!',
        })
      }

      // 2. calculate isGranted
      const isOwn = user._id == userId
      const isAdmin = user.isAdmin

      const ownGranted = ac.can(roles.basic)[action + 'Own'](resource).granted
      const adminGranted = ac.can(roles.admin)[action + 'Any'](resource).granted
      const isGranted = (isOwn && ownGranted) || (isAdmin && adminGranted)

      // 3. pass or reject based on isGranted
      if (isGranted) {
        next()
      } else {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action",
        })
      }
    } catch (error) {
      next(error)
    }
  }
}

/*
pre-cond: 
  1. target restaurantId: req.params.restaurantId;
  2. verified loginedUser: req.user 
  3. assuming data structure of restaurant.userGroups is { role: [userId] }

post-cond
  1. if user has permission on [target restaurant : target resource]: pass to next() 
  2. else: 401 
*/
const requestAccessOnRestaurant = function(resource, action) {
  return async (req, res, next) => {
    try {
      // 1. check pre-cond
      const restaurantId = req.params
      const { user } = req
      if (!restaurantId || !user) {
        return res.status(500).json({
          error: 'Precond not satisfied! restaurantId or req.user not exist!',
        })
      }

      const restaurant = await Restaurant.findById(restaurantId)
      if (!restaurant) {
        return res.status(404).json({
          error: 'Restaurant not found. Id: ' + restaurantId,
        })
      }

      // 2. calculate isGranted
      // Assumption -- restaurant.userGroups - { role: [userId] }
      var isGranted = false // default
      const userGroups = restaurant.userGroups
      for (const role in userGroups) {
        if (userGroups.hasOwnProperty(role)) {
          const userIds = userGroups[role]
          if (
            userIds.includes(user._id) &&
            ac.can(roles[role])[action + 'Own'](resource).granted
          ) {
            isGranted = true
            break
          }
        }
      }

      // 3. pass or reject based on isGranted
      if (isGranted) {
        next()
      } else {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action",
        })
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = {
  scopes,
  roles,
  allowIfLoggedin,
  requestAccessOnRestaurant,
  requestAccess,
}
