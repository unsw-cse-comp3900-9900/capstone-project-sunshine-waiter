const { accessControl: ac } = require('./accessControl')
const Restaurant = require('../models/restaurant.model')

const scopes = Object.freeze({ website_admin: 1, restaurant: 2 })
const roles = Object.freeze({
  // every user has this role
  basic: 'basic',

  // restaurant
  owner: 'owner',
  manager: 'manager',
  cashier: 'cashier',
  cook: 'cook',
  waiter: 'waiter',
  customer: 'customer',

  // website_admin
  admin: 'admin',
})

const isValidRole = (role) => roles[role] !== undefined

const actions = Object.freeze({
  create: 'create',
  read: 'read',
  update: 'update',
  delete: 'delete',
})

const resources = Object.freeze({
  profile: 'profile',
  order: 'order',
  dashboard: 'dashboard',
  restaurant: 'restaurant',
  menu: 'menu',
  stuff: 'stuff',
  cooking_queue: 'cooking_queue',
  serving_queue: 'serving_queue',
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
const requestAccess = function (scope, action, resource) {
  if (scope === scopes.website_admin) {
    return requestAccessOnUser(action, resource)
  } else {
    // scope === scopes.restaurant
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
const requestAccessOnUser = function (action, resource) {
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

/*
pre-cond: 
  1. target restaurantId: req.params.restaurantId; 
  2. verified loginedUser: req.user 
  3. assuming data structure of restaurant.userGroups is { role: [userId] }

post-cond
  1. if user has (the role that has) permission on [target restaurant : target resource]: pass to next() 
  2. else: 403 forbidden
*/
const requestAccessOnRestaurant = function (action, resource) {
  return async (req, res, next) => {
    try {
      const { restaurantId } = req.params

      // 1. on 'restaurants/' ; no restaurantId presented
      if (!restaurantId && resource == 'restaurant') {
        const isGranted = ac.can(roles.basic)[action + 'Own'](resource).granted
        if (isGranted) return next()
      }

      // 2. on 'restaurants/:restaurantId/'
      // 2.1 verify user
      const { user } = req
      if (!user)
        return res.status(500).json({
          error: 'Precond not satisfied! restaurantId or req.user not exist!',
        })

      // 2.2 verify restaurant
      const restaurant = await Restaurant.findById(restaurantId)
      if (!restaurant) {
        return res.status(404).json({
          error: 'Restaurant not found. Id: ' + restaurantId,
        })
      }

      // 3. calculate isGranted

      // Assumption -- restaurant.userGroups - { role: [userId] }
      const isGranted = (user, restaurant, action, resource) => {
        const userGroups = restaurant.userGroups

        for (let [roleType, userIdArray] of Object.entries(userGroups)) {
          if (
            userGroups.hasOwnProperty(roleType) && // skip inherited properties. e.g "$init"
            Array.isArray(userIdArray) &&
            userIdArray.includes(user._id) && // current user has the role
            ac.can(roleType)[action + 'Own'](resource).granted // the role has the permission
          ) {
            return true
          }
        }
        return false
      }

      // 3. pass or reject based on isGranted
      if (isGranted(user, restaurant, action, resource)) {
        next()
      } else {
        return res.status(403).json({
          error: `You don't have enough permission to perform ${action} on ${resource}`,
        })
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = {
  roles,
  isValidRole,
  scopes,
  actions,
  resources,
  allowIfLoggedin,
  requestAccess,
}
