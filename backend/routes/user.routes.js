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
} = require('../controllers/user.controller')

router.post('/login', login)

router.post('/', createUser)

router.get(
  '/:userId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.website_admin, 'read', 'profile'),
  readUser
)

router.put(
  '/:userId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.website_admin, 'update', 'profile'),
  updateUser
)

router.delete(
  '/:userId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.website_admin, 'delete', 'profile'),
  deleteUser
)

module.exports = router
