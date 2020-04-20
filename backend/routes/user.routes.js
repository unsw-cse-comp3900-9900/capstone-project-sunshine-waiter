const express = require('express')
const router = express.Router()

const { verifyAuthToken, login } = require('../auth/authentication')
const {
  scopes,
  actions,
  resources,
  allowIfLoggedin,
  requestAccess,
} = require('../auth/authorization')

const {
  createUser,
  readById,
  updateUser,
  deleteUser,
  readMe,
  uploadImage,
} = require('../controllers/user.controller')

const { singleImageUploadHandler } = require('../middleware/imageUploadHanlder')

router.post('/login', login)

router.post('/', createUser)

router.get('/me', verifyAuthToken, allowIfLoggedin, readMe)

router.get('/:userId', readById)

router.put(
  '/:userId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.account, actions.update, resources.profile),
  updateUser
)

router.delete(
  '/:userId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.account, actions.delete, resources.profile),
  deleteUser
)

router.post(
  '/:userId/img',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.account, actions.update, resources.profile),
  singleImageUploadHandler((key = 'image')),
  // when frontend uploads file, the above key matches
  uploadImage
)

module.exports = router
