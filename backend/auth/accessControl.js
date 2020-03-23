const AccessControl = require('accesscontrol')

// website-wide access control policy
// TODO: decide all the attributes
const accessGranted = {
  // roles in administration
  admin: {
    profile: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
  },

  basic: {
    profile: {
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
    restaurant_management: {
      'create:own': ['*'],
      'delete:own': ['*'],
    },
  },

  // roles in restaurant
  customer: {},

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
}

const accessControl = new AccessControl(accessGranted)

module.exports = { accessControl }
