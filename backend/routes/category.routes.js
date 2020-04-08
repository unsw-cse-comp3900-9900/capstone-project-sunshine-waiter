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
  createCategory,
  readCategory,
  readCategoryPublicly,
  updateCategory,
  deleteCategory,
  readMany,
  readManyPublicly,
} = require('../controllers/category.controller')

// CRUD

// public access
router.get(
  '/:restaurantId/categories/:categoryId/public/',
  readCategoryPublicly
)
router.get('/:restaurantId/categories/public/', readManyPublicly)

// owner/manager access
router.post(
  '/:restaurantId/categories/',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.create, resources.menu),
  createCategory
)

router.get(
  '/:restaurantId/categories/:categoryId/',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.read, resources.menu),
  readCategory
)
router.get(
  '/:restaurantId/categories/',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.read, resources.menu),
  readMany
)

router.put(
  '/:restaurantId/categories/:categoryId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.update, resources.menu),
  updateCategory
)

router.delete(
  '/:restaurantId/categories/:categoryId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.delete, resources.menu),
  deleteCategory
)

module.exports = router
