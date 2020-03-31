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
  createOrderItem,
  readOrderItem,
  updateOrderItem,
  deleteOrderItem,
  readMany,
} = require('../controllers/orderItem.controller')

// orderItem CRUD

// public access
router.get('/:restaurantId/menuitems/:orderItemId', readOrderItem)
router.get('/:restaurantId/menuitems/', readMany)

// owner/manager access
router.post(
  '/:restaurantId/menuitems/',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.create, resources.menu),
  createOrderItem
)
router.put(
  '/:restaurantId/menuitems/:orderItemId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.update, resources.menu),
  updateOrderItem
)

router.delete(
  '/:restaurantId/menuitems/:orderItemId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.delete, resources.menu),
  deleteOrderItem
)

module.exports = router
