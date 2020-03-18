const express = require('express')
const router = express.Router()

const { verifyAuthToken, login } = require('../auth/authentication')
const {
  scopes,
  allowIfLoggedin,
  requestAccess,
} = require('../auth/authorization')

const {
  createUser,
  readUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController')

router.post('/login', login)

router.post('/', createUser)

router.get(
  '/:userId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.administration, 'read', 'profile'),
  readUser
)

router.put(
  '/:userId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.administration, 'update', 'profile'),
  updateUser
)

router.delete(
  '/:userId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.administration, 'delete', 'profile'),
  deleteUser
)

module.exports = router
