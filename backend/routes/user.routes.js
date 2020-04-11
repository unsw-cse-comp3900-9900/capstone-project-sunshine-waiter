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
  readUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller')

router.post('/login', login)

router.post('/', createUser)

router.get('/:userId', readUser)

router.put(
  '/:userId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.website_admin, actions.update, resources.profile),
  updateUser
)

router.delete(
  '/:userId',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.website_admin, actions.delete, resources.profile),
  deleteUser
)

module.exports = router
