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
  readMenu,
  readMenuPublicly,
  updateMenu,
} = require('../controllers/menu.controller')

// public
router.get('/:restaurantId/menus/public', readMenuPublicly)

// managment
router.get(
  '/:restaurantId/menus',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.read, resources.menu),
  readMenu
)

router.put(
  '/:restaurantId/menus',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.update, resources.menu),
  updateMenu
)

module.exports = router
