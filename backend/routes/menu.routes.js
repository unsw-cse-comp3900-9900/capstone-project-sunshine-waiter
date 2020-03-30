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

const { readMenu, updateMenu } = require('../controllers/menu.controller')

router.get('/:restaurantId/menus', readMenu)

router.put(
  '/:restaurantId/menus',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.update, resources.menu),
  updateMenu
)

module.exports = router
