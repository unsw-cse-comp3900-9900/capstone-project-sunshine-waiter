const express = require('express')
const router = express.Router()

const { verifyAuthToken } = require('../auth/authentication')
const {
  scopes,
  allowIfLoggedin,
  requestAccess,
} = require('../auth/authorization')

const { readMenu, updateMenu } = require('../controllers/menu.controller')

router.get('/:restaurantId/menus', readMenu)

router.put(
  '/:restaurantId/menus',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, 'update', 'restaurant_management'),
  updateMenu
)

module.exports = router
