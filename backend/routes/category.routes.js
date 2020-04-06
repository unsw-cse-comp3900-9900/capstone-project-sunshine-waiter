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
  updateCategory,
  deleteCategory,
  readMany,
} = require('../controllers/category.controller')

// CRUD

// public access
router.get('/:restaurantId/categories/:categoryId', readCategory)
router.get('/:restaurantId/categories/', readMany)

// owner/manager access
router.post(
  '/:restaurantId/categories/',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.create, resources.menu),
  createCategory
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
