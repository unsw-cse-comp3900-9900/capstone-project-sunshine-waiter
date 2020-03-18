const express = require('express')
const router = express.Router()

const { tokenVerification, login } = require('../auth/authentication')
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
  tokenVerification,
  allowIfLoggedin,
  requestAccess(scopes.administration, 'read', 'profile'),
  readUser
)

router.put(
  '/:userId',
  tokenVerification,
  allowIfLoggedin,
  requestAccess(scopes.administration, 'update', 'profile'),
  updateUser
)

router.delete(
  '/:userId',
  tokenVerification,
  allowIfLoggedin,
  requestAccess(scopes.administration, 'delete', 'profile'),
  deleteUser
)

module.exports = router
