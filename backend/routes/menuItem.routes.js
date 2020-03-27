const express = require('express')
const router = express.Router()

const { verifyAuthToken } = require('../auth/authentication')
const {
  scopes,
  allowIfLoggedin,
  requestAccess,
} = require('../auth/authorization')

const {
  createMenuItem,
  readMenuItem,
  updateMenuItem,
  deleteMenuItem,
  readMany,
} = require('../controllers/menuItem.controller')

// menuItem CRUD

// public access
router.get('/:restaurantId/menuitems/:menuItemId', readMenuItem)
router.get('/:restaurantId/menuitems/', readMany)

// owner/manager access
router.post(
  '/:restaurantId/menuitems/',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, 'create', 'menuItem'),
  createMenuItem
)
router.put(
  '/:restaurantId/menuitems/:menuItemId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, 'update', 'menuItem'),
  updateMenuItem
)

router.delete(
  '/:restaurantId/menuitems/:menuItemId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, 'delete', 'menuItem'),
  deleteMenuItem
)

module.exports = router
