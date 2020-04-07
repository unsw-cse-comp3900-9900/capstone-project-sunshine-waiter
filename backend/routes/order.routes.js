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
  readMany,
  updatePaymentStatus,
} = require('../controllers/order.controller')

// order CRUD

// public access ( customer dosen't need to login/register )
router.post('/:restaurantId/orders/', createOrder)
router.get('/:restaurantId/orders/:orderId', readOrder)
router.get('/:restaurantId/orders/:orderId/items', readItemsInOrder)

// owner/manager access
router.get(
  '/:restaurantId/orders/',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.update, resources.order),
  // readMany is for order management only.
  readMany
)

router.patch(
  '/:restaurantId/orders/:orderId/payment',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.update, resources.order),
  updatePaymentStatus
)

module.exports = router
