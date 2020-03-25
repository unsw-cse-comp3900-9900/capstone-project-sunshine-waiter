const AccessControl = require('accesscontrol')

// website-wide access control policy
// TODO: decide all the attributes
const accessGranted = {
  // Every user has this role
  basic: {
    profile: {
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },

    restaurant_management: {
      // here, "own" means: restaurant.createdBy == user._id
      // that is, current user is the creator&owner of the restaurant
      'create:own': ['*'],
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
  },

  // website admin
  admin: {
    profile: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
  },

  // roles in restaurant
  // here, "own" means: restaurant.userGroups[role].includes(user._id)
  // that is, current user is in the role-group of restaurant
  manager: {
    restaurant_management: {
      // including restaurant history data, staff management, menu, etc
      'read:own': ['*'],
      'update:own': ['*'],
    },
    cooking_queue: {
      'read:own': ['*'],
      'update:own': ['*'],
    },
    serving_queue: {
      'read:own': ['*'],
      'update:own': ['*'],
    },
    order: {
      'read:own': ['*'],
      'update:own': ['*'],
    },
    dashboard: {
      'read:own': ['*'],
      'update:own': ['*'],
    },
  },
  cook: {
    cooking_queue: {
      'read:own': ['*'],
      'update:own': ['*'],
    },
  },
  waiter: {
    serving_queue: {
      'read:own': ['*'],
      'update:own': ['*'],
    },
  },
  cashier: {
    order: {
      'read:own': ['*'],
      'update:own': ['*'],
    },
  },
}

const accessControl = new AccessControl(accessGranted)

module.exports = { accessControl }
