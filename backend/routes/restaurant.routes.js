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
  createRestaurant,
  readRestaurant,
  readMyRestaurants, // read all restaurants created by current user
  updateRestaurant,
  deleteRestaurant,
} = require('../controllers/restaurant.controller')

// restaurant CRUD
router.post(
  '/',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.create, resources.restaurant),
  createRestaurant
)

router.get(
  '/:restaurantId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.read, resources.restaurant),
  readRestaurant
)

router.get(
  '/',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.read, resources.restaurant),
  readMyRestaurants
)

router.put(
  '/:restaurantId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.update, resources.restaurant),
  updateRestaurant
)

router.delete(
  '/:restaurantId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.delete, resources.restaurant),
  deleteRestaurant
)

module.exports = router
