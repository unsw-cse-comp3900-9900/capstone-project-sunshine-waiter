const router = require('express').Router()

const {
  acceptJob,
  resignJob,
  inviteStaff,
  deleteStaff,
} = require('../controllers/staff.controller')

const { verifyAuthToken } = require('../auth/authentication')
const {
  scopes,
  actions,
  resources,
  allowIfLoggedin,
  requestAccess,
} = require('../auth/authorization')

router.post(
  '/users/:userId/roles',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.account, actions.update, resources.profile), // TODO: add appropriate resources
  acceptJob
)

router.delete(
  '/users/:userId/roles',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.account, actions.update, resources.profile), // TODO: add appropriate resources
  resignJob
)

// manager invite a staff to a user group
router.post(
  '/restaurants/:restaurantId/staff/',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.update, resources.staff),
  inviteStaff
)

// manager remove a staff from a user group
router.delete(
  '/restaurants/:restaurantId/staff/',
  verifyAuthToken,
  allowIfLoggedin,
  requestAccess(scopes.restaurant, actions.update, resources.staff),
  deleteStaff
)

module.exports = router
