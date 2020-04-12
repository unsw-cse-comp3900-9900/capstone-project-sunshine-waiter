const {
  findRestaurant,
  findById: findRestaurantById,
} = require('./restaurant.controller')
const { validateObjectId, validateRole } = require('../util')
const { findByEmail: findUserByEmail } = require('./user.controller')

/*
Bis: User can accept invitation
API: Post '/users/userId/roles/'
  { "restaurantId": "123423411234125254", "role": "cook"}

precond
  - req.user exist
  - req.body: { "restaurantId": "123423411234125254", "role": "cook"}
postcond
  - if(inputValid) then 
    - targetRestaurant.userGroups[role].includes(req.user._id)
    - user.currentJobs.includes({restaurantId, role})
    - !user.pendingJobs.includes({restaurantId, role})
  - if(!inputValid) then 
    - nothing change on DB
    - res.data.message: a proper error message

  - inputValid
    - validateObjectId(restaurantId) && targetObjectExist(restaurantId)
    - isValidRole(role)
    - req.user.pendingJobs.includes({restaurantId, role})
*/
acceptJob = async (req, res, next) => {
  try {
    const { restaurant, role, user } = await validateBasicOnJob(req)
    if (!user.pendingJobs.includes({ restaurant, role }))
      throw {
        httpCode: 404,
        message: `user.pendingJobs does not includes target job `,
        problematicData: req.body,
      }

    await dbUserAcceptJob(restaurant, role, user)
    res.send(user)
  } catch (error) {
    next(error)
  }
}

// - targetRestaurant.userGroups[role].includes(req.user._id)
// - user.currentJobs.includes({restaurantId, role})
// - !user.pendingJobs.includes({restaurantId, role})
dbUserAcceptJob = async (restaurant, role, user) => {
  // TODO: make it transaction
  user.pendingJobs = user.pendingJobs.filter(
    (job) => !(job.restaurant.equals(restaurant._id) && job.role === role)
  )
  user.currentJobs.push({ restaurant, role })
  await user.save()

  restaurant.userGroups[role].push(user._id)
  await restaurant.save()
}

/*
Bis: User can resign
API: Delete '/users/:userId/roles/'

precond: 
  - req.user exists;
  - req.body: { "restaurantId": "123423411234125254", "role": "cook"}
postcond:
  - if(inputValid) then 
    - !targetRestaurant.userGroups[role].includes(req.user._id)
    - !user.currentJobs.includes({restaurantId, role})
  - else: 
    - nothing change on DB
    - res.data.message: a proper error message

  - inputValid:
    - req.user 
    - validateObjectId(restaurantId) && targetObjectExist(restaurantId)
    - isValidRole(role)
*/
resignJob = async (req, res, next) => {
  try {
    const { restaurant, role, user } = await validateBasicOnJob(req)
    await dbUserResignJob(restaurant, role, user)
    res.send(user)
  } catch (error) {
    next(error)
  }
}
validateBasicOnJob = async (req) => {
  const user = req.user
  if (!user)
    throw { httpCode: 500, message: 'Precondition failed: req.user not exist!' }

  const { restaurant: restaurantId, role } = req.body

  validateRole(role)
  validateObjectId(restaurantId)
  const restaurant = await findRestaurantById(restaurantId)

  return { restaurant, role, user }
}
dbUserResignJob = async (restaurant, role, user) => {
  restaurant.userGroups[role].filter((id) => !id.equals(user._id))
  user.currentJobs.filter(
    (serving) =>
      !serving.restaurant.equals(restaurant._id) || serving.role != role
  )
  await restaurant.save()
}

/* 
basic design:
- Owner is the one who create this restaurant. It can only changed by website owner. 
- Manager is the one has almost same permision as owner, except inviting/deleting manager
- Owner/manager can invite anyone become a staff. 
*/

/*
* [ ] All staff in a restaurant can read other staff's basic infomation. such as name, picture etc.
      Get '/restaurants/restaurantId/staff/'
*/
readStaff = async (req, res, next) => {
  console.log(req.body)
  res.send('not yet implemented')
}

//
/*
*   [ ] Manger can send invitation to user (by email adress)

        
          => validate( User.find({email:email}) exists )
              .then( user.pendingJobs.push(role)  )
              .catch(send error)
    > manager cannot cancel invitation. but invitation will be expired in 1 d.
*/

/*
Bis: User can accept invitation
API:  Post '/restaurants/:restaurantId/staff/'
      req.body: { email, role }
precond ( and validation )
  - restaurant  (restaurantId) exist
  - targetUser = User.findOne({email}); targetUser !== undifine
  - isValidRole(role)
postcond
  - targetUser.pendingJobs.includes({restaurantId, role})
*/
inviteStaff = async (req, res, next) => {
  const { restaurant, role, user } = await validationOnStaff(req)
  const result = dbInviteStaff({ restaurant, role, user })
  res.json(result)
}
const dbInviteStaff = async ({ restaurant, role, user }) => {
  user.pendingJobs.push({ restaurant, role })
  user.save()
  return { message: 'Your invitation is sent' }
}

const validationOnStaff = async (req) => {
  const restaurant = findRestaurant(req)
  const { email, role } = req.body
  validateRole(role)

  const isGranted =
    (restaurant.userGroups['owner'].includes(req.user._id) &&
      role !== 'owner') ||
    (restaurant.userGroups['manager'].includes(req.user._id) &&
      role !== 'owner' &&
      role !== 'manager')
  if (!isGranted)
    throw {
      httpCode: 403,
      message: `Your role in restaurant ${restaurant._id} does not have enough permission to operate on staff of role ${role}.`,
    }

  const user = await findUserByEmail(email)
  return { restaurant, role, user }
}

/*
Bis: manager can remove staff
API:  Delete '/restaurants/:restaurantId/staff/'
      req.body: { email, role }

precond ( and validation )
  - restaurant  (restaurantId) exist
  - targetUser = User.findOne({email}); targetUser !== undifine
  - isValidRole(role)
  - permission: 
    (
      restaurant.userGroups[owner].includes(req.user._id) 
      && role !== owner 
    ) || (
      restaurant.userGroups[manager].includes(req.user._id) 
      && role !== owner && role !== manager 
    )
*/
removeStaff = async (req, res, next) => {
  const { restaurant, role, user } = await validationOnStaff(req)
  const result = dbDeleteStaff({ restaurant, role, user })
  res.json(result)
}
const dbDeleteStaff = async ({ restaurant, role, user }) => {
  user.currentJobs.filter(
    (job) => !(job.restaurant.equals(restaurant._id) && job.role === role)
  )
  user.save()
  restaurant.userGroups[role].filter((userId) => userId !== user._id)
  return {
    message: `Successfully removed user ( email: ${user.email}) from ${role} group of restaurant ${restaurant._id}.`,
  }
}

module.exports = {
  acceptJob,
  resignJob,
  inviteStaff,
  removeStaff,
}
