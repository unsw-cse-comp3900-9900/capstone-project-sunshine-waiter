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
  createMenuItem,
  readMenuItem, // for restauratn staff
  readMenuItemPublicly,
  updateMenuItem,
  deleteMenuItem,
  readMany,
  readManyPublicly,
  uploadImage,
  readImage,
  deleteImage,
} = require('../controllers/menuItem.controller')
const { singleImageUploadHandler } = require('../middleware/imageUploadHanlder')

// menuItem CRUD
const paths = {
  collection: '/:restaurantId/menuitems/',
  obj: '/:restaurantId/menuitems/:menuItemId',
  objImg: '/:restaurantId/menuitems/:menuItemId/img',
  collectionPublic: '/:restaurantId/menuitems/public/',
  objPublic: '/:restaurantId/menuitems/:menuItemId/public/',
}

// public access
router.get('/:restaurantId/menuitems/:menuItemId/public/', readMenuItemPublicly)
router.get('/:restaurantId/menuitems/public/', readManyPublicly)

// owner/manager access
router.post(
  '/:restaurantId/menuitems/',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.create, resources.menu),
  createMenuItem
)
router.get(
  '/:restaurantId/menuitems/:menuItemId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.read, resources.menu),
  readMenuItem
)
router.get(
  '/:restaurantId/menuitems',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.read, resources.menu),
  readMany
)
router.put(
  '/:restaurantId/menuitems/:menuItemId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.update, resources.menu),
  updateMenuItem
)

router.delete(
  '/:restaurantId/menuitems/:menuItemId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.delete, resources.menu),
  deleteMenuItem
)

// image: upload, read, delete
router.post(
  paths.objImg,
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.update, resources.menu),
  singleImageUploadHandler((key = 'image')),
  // when frontend uploads file, the above key matches
  uploadImage
)

router.get(paths.objImg, readImage)

router.delete(
  paths.objImg,
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.update, resources.menu),
  deleteImage
)

module.exports = router
