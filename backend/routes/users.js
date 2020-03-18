const express = require('express')

const router = express.Router()
const { createUser, readUser } = require('../controllers/userController')

const { tokenVerification, login } = require('../auth/authentication')
const { scopes } = require('../auth/accessControl')
const { allowIfLoggedin, requestAccess } = require('../auth/authorization')

router.post('/login', login)

router.post('/', createUser)

router.get(
  '/:userId',
  tokenVerification,
  allowIfLoggedin,
  requestAccess(scopes.administration, 'read', 'profile'),
  readUser
)

module.exports = router
