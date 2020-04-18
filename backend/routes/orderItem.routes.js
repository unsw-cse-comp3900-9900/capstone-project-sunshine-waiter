const express = require('express')
const router = express.Router()

const { verifyAuthToken } = require('../auth/authentication')
const {
  scopes,
  actions,
  resources,
  allowIfLoggedin,
  requestAccess,
} = require('../auth/authorization')

const {
  readOrderItem,
  readAllItemInRestaurant,
} = require('../controllers/orderItem.controller')

// orderItem CRUD

// public access
router.get('/:restaurantId/orderItems/:orderItemId', readOrderItem)

router.get(
  '/:restaurantId/orderitems/',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.read, resources.order),
  readAllItemInRestaurant
)

module.exports = router
