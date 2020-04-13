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
} = require('../controllers/user.controller')

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

module.exports = router
