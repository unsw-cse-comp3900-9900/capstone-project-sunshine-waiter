const AccessControl = require('accesscontrol')

// website-wide access control policy
// TODO: decide all the attributes
const accessGranted = {
  // Every user has this role
  basic: {
    profile: {
      // here, "own" means: targetUser._id == user._id
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },

    restaurant_management: {
      // here, "own" means: restaurant.createdBy == user._id
      // that is, current user is the creator&owner of the restaurant
      'create:own': ['*'],
    },
    order: {
      // here, "own" means: order.placedBy == user._id
      'create:own': ['*'],
      'read:own': ['*'],
    },
    menuItem: {
      'create:own': ['*'],
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
  },

  // roles in restaurant
  // here, "own" means: restaurant.userGroups[role].includes(user._id)
  // that is, current user is in the role-group of restaurant
  owner: {
    restaurant_management: {
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
    menu_management: {
      'create:own': ['*'],
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
    stuff_management: {
      'create:own': ['*'],
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
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
      // active order; majorly for cashier page
      'read:own': ['*'],
      'update:own': ['*'],
    },
    dashboard: {
      // including stuff management; order history; menu update
      'read:own': ['*'],
      'update:own': ['*'],
    },
  },
  manager: {
    restaurant_management: {
      // including restaurant history data, staff management, menu, etc
      'read:own': ['*'],
      'update:own': ['*'],
    },
    menu_management: {
      'create:own': ['*'],
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
    stuff_management: {
      'create:own': ['*'],
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
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
      // active order; majorly for cashier page
      'read:own': ['*'],
      'update:own': ['*'],
    },
    dashboard: {
      // including stuff management; order history; menu update
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

  // website admin
  admin: {
    profile: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
  },
}

const accessControl = new AccessControl(accessGranted)

module.exports = { accessControl }
