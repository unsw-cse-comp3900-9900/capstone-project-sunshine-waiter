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
  createOrder,
  readOrder,
  updateOrder,
  deleteOrder,
  readMany,
} = require('../controllers/order.controller')

// order CRUD

// public access
router.get('/:restaurantId/menuitems/:orderId', readOrder)
router.get('/:restaurantId/menuitems/', readMany)

// owner/manager access
router.post(
  '/:restaurantId/menuitems/',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.create, resources.menu),
  createOrder
)
router.put(
  '/:restaurantId/menuitems/:orderId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.update, resources.menu),
  updateOrder
)

router.delete(
  '/:restaurantId/menuitems/:orderId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.delete, resources.menu),
  deleteOrder
)

module.exports = router
