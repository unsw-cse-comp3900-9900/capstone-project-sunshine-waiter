const { accessControl: ac } = require('./accessControl')
const Restaurant = require('../models/restaurant')

const scopes = Object.freeze({ website_admin: 1, restaurant: 2 })
const roles = Object.freeze({
  // every user has this role
  basic: 'basic',

  // restaurant
  manager: 'manager',
  cashier: 'cashier',
  cook: 'cook',
  waiter: 'waiter',
  customer: 'customer',

  // website_admin
  admin: 'admin',
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

// website_admin
const requestAccess = function(scope, action, resource) {
  if (scope === scopes.website_admin) {
    return requestAccessOnUser(action, resource)
  } else if (action === 'create' && resource === 'restaurant_management') {
    // This is a corner case. At this moment, restaurant haven got created. No restaurantId yet.
    return requestAccessOnCreateRestaurant('create', 'restaurant_management')
  } else if (scope === scopes.restaurant) {
    return requestAccessInRestaurant(action, resource)
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
      const { userId } = req.params
      const { user } = req
      if (!userId || !user) {
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

const requestAccessOnCreateRestaurant = function(action, resource) {
  return async (req, res, next) => {
    try {
      const isGranted = ac.can(roles.basic)[action + 'Own'](resource).granted
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
  1. if user has (the role that has) permission on [target restaurant : target resource]: pass to next() 
  2. else: 403 forbidden
*/
const requestAccessInRestaurant = function(action, resource) {
  return async (req, res, next) => {
    try {
      // 1. check pre-cond
      const { restaurantId } = req.params
      const { user } = req
      if (!restaurantId || !user) {
        return res.status(500).json({
          error: 'Precond not satisfied! restaurantId or req.user not exist!',
        })
      }
      // verify restaurantId

      const restaurant = await Restaurant.findById(restaurantId)
      if (!restaurant) {
        return res.status(404).json({
          error: 'Restaurant not found. Id: ' + restaurantId,
        })
      }

      // 2. calculate isGranted
      const isGrantedAsOwner =
        restaurant.createdBy.equals(user._id) &&
        ac.can(roles.basic)[action + 'Own'](resource).granted

      // TODO: test this part
      // Assumption -- restaurant.userGroups - { role: [userId] }
      const isGrantedAsStuff = (user, restaurant, action, resource) => {
        const userGroups = restaurant.userGroups
        for (const role in Object.keys(userGroups)) {
          if (userGroups.hasOwnProperty(role)) {
            const userIds = userGroups[role]
            if (
              userIds.includes(user._id) &&
              ac.can(roles[role])[action + 'Own'](resource).granted
            ) {
              return true
            }
          }
        }

        return false
      }

      // 3. pass or reject based on isGranted
      if (
        isGrantedAsOwner ||
        isGrantedAsStuff(user, restaurant, action, resource)
      ) {
        next()
      } else {
        return res.status(403).json({
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
  requestAccessInRestaurant,
  requestAccess,
}
