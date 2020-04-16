const AccessControl = require('accesscontrol')

// website-wide access control policy
const accessGranted = {
  // Every user has this role
  basic: {
    profile: {
      // here, "own" means: targetUser._id == user._id
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
    job: {
      // here, "own" means: targetUser._id == user._id
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
    restaurant: {
      // here, "own" means: restaurant.createdBy == user._id
      // that is, current user is the creator&owner of the restaurant
      'create:own': ['*'],
      'read:own': ['*'],
    },
    order: {
      // here, "own" means: order.placedBy == user._id
      'create:own': ['*'],
      'read:own': ['*'],
    },
  },

  // roles in restaurant
  // here, "own" means: restaurant.userGroups[role].includes(user._id)
  // that is, current user is in the role-group of restaurant
  owner: {
    restaurant: {
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
    menu: {
      'create:own': ['*'],
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
    staff: {
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
      // including staff management; order history; menu update
      'read:own': ['*'],
      'update:own': ['*'],
    },
  },
  manager: {
    restaurant: {
      // including restaurant history data, staff management, menu, etc
      'read:own': ['*'],
      'update:own': ['*'],
    },
    menu: {
      'create:own': ['*'],
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
    staff: {
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
      // including staff management; order history; menu update
      'read:own': ['*'],
      'update:own': ['*'],
    },
  },
  cook: {
    cooking_queue: {
      'read:own': ['*'],
      'update:own': ['*'],
    },
    restaurant: {
      'read:own': ['*'],
    },
  },
  waiter: {
    serving_queue: {
      'read:own': ['*'],
      'update:own': ['*'],
    },
    restaurant: {
      'read:own': ['*'],
    },
  },
  cashier: {
    order: {
      'read:own': ['*'],
      'update:own': ['*'],
    },
    restaurant: {
      'read:own': ['*'],
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
