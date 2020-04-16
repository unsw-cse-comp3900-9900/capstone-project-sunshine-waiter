const {
  findRestaurant,
  findById: findRestaurantById,
} = require('./restaurant.controller')
const {
  validateObjectId,
  validateRole,
  performTransaction,
} = require('../util')
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

    if (
      !user.pendingJobs.find(
        (job) => job.restaurant.equals(restaurant._id) && job.role === role
      )
    )
      throw {
        httpCode: 404,
        message: `user.pendingJobs does not includes target job `,
        problematicData: req.body,
      }

    await dbUserAcceptJob(restaurant, role, user)
    res.json({
      message: 'Successfully accept job.',
      job: { restaurant: restaurant._id, role },
      user,
    })
  } catch (error) {
    next(error)
  }
}

// - targetRestaurant.userGroups[role].includes(req.user._id)
// - user.currentJobs.includes({restaurantId, role})
// - !user.pendingJobs.includes({restaurantId, role})
dbUserAcceptJob = async (restaurant, role, user) => {
  const transaction = async () => {
    user.pendingJobs = user.pendingJobs.filter(
      (job) => !compareJob(job, { restaurant, role })
    )
    user.currentJobs.push({ restaurant: restaurant._id, role })
    await user.save()

    restaurant.userGroups[role].push(user._id)
    await restaurant.save()
  }

  await performTransaction(transaction)
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
    // check currentJob
    const isFound = user.currentJobs.find((job) =>
      compareJob(job, { restaurant, role })
    )
    if (!isFound) throw { httpCode: 204, message: '' }

    await dbUserResignJob(restaurant, role, user)

    res.json({
      message: 'Successfully resign job.',
      job: { restaurant: restaurant._id, role },
      user,
    })
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
  const transaction = async () => {
    restaurant.userGroups[role] = restaurant.userGroups[role].filter(
      (id) => !id.equals(user._id)
    )
    await restaurant.save()
    user.currentJobs = user.currentJobs.filter(
      (job) => !compareJob(job, { restaurant, role })
    )
    await user.save()
  }
  await performTransaction(transaction)
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
  try {
    const { restaurant, role, staff } = await validationOnStaff(req)
    const result = await dbInviteStaff({ restaurant, role, staff })
    res.json(result)
  } catch (error) {
    next(error)
  }
}
const dbInviteStaff = async ({ restaurant, role, staff }) => {
  staff.pendingJobs = staff.pendingJobs.filter(
    (job) => !compareJob(job, { restaurant, role })
  )
  staff.pendingJobs.push({ restaurant: restaurant._id, role })
  staff.save()
  return {
    message: `Your invitation of role ${role} is sent to ${staff.email}.`,
  }
}

const validationOnStaff = async (req) => {
  const restaurant = await findRestaurant(req)
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

  const staff = await findUserByEmail(email)
  return { restaurant, role, staff }
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
  try {
    const validation = async (req) => {
      const { restaurant, role, staff } = await validationOnStaff(req)
      const isFound = restaurant.userGroups[role].find((id) =>
        id.equals(staff._id)
      )
      if (!isFound) throw { httpCode: 204, message: '' }
      return { restaurant, role, staff }
    }

    const input = await validation(req)
    const result = await dbDeleteStaff(input)
    res.json(result)
  } catch (error) {
    next(error)
  }
}
const dbDeleteStaff = async ({ restaurant, role, staff }) => {
  const transaction = async () => {
    staff.currentJobs = staff.currentJobs.filter(
      (job) => !compareJob(job, { restaurant, role })
    )
    await staff.save()
    restaurant.userGroups[role] = restaurant.userGroups[role].filter(
      (userId) => !userId.equals(staff._id)
    )
    await restaurant.save()
  }
  await performTransaction(transaction)

  return {
    message: `Successfully removed user ( email: ${staff.email}) from ${role} group of restaurant ${restaurant._id}.`,
  }
}

compareJob = (job, { restaurant, role }) =>
  job.restaurant.equals(restaurant._id) && job.role === role

module.exports = {
  acceptJob,
  resignJob,
  inviteStaff,
  removeStaff,
}
