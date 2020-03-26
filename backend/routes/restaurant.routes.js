const express = require('express')
const router = express.Router()

const { verifyAuthToken } = require('../auth/authentication')
const {
  scopes,
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
  requestAccess(scopes.restaurant, 'create', 'restaurant_management'),
  createRestaurant
)

router.get(
  '/:restaurantId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, 'read', 'restaurant_management'),
  readRestaurant
)

router.get(
  '/',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, 'read', 'restaurant_management'),
  readMyRestaurants
)

router.put(
  '/:restaurantId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, 'update', 'restaurant_management'),
  updateRestaurant
)

router.delete(
  '/:restaurantId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, 'delete', 'restaurant_management'),
  deleteRestaurant
)

module.exports = router
