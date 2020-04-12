const { isValidObjectId } = require('../util')
const { roles, isValidRole } = require('../auth/authorization')

/*

*   [ ] User can accept invitation
    Post '/users/userId/roles/'
      { "restaurantId": "123423411234125254", "role": "cook"}
        => validate( restaurantId, role, user.invitations.check_expire_date )
          .then(
            if (!restaurant.userGroups[role].includes(user._id)) {
              restaurant.userGroups[role].push(user._id)
            })
          .catch(blabla)
*/
acceptJob = async (req, res, next) => {}

/*
Bis: User can resign
API: Delete '/users/userId/roles/'

precond: 
  - req.user exists;
  - req.body: { "restaurantId": "123423411234125254", "role": "cook"}
postcond:
  - if(inputValid) then !targetRestaurant.userGroups[role].includes(req.user._id)
  - else: 
    - nothing change on DB
    - res.data.message: a proper error message

  inputValid:
    - req.user 
    - isValidObjectId(restaurantId) && targetObjectExist(restaurantId)
    - isValidRole(role)
*/
resignJob = async (req, res, next) => {
  try {
    const { resaurant, role, userId } = validateOnResignJob(req)
    resaurant.userGroups[role].filter((id) => !id.equals(userId))
    await resaurant.save()
    res.send(ok)
  } catch (error) {
    next(error)
  }
}
validateOnResignJob = (req) => {
  const user = req.user
  if (!user)
    throw { httpCode: 500, message: 'Precondition failed: req.user not exist!' }

  const { resaurant, role } = req.body
  if (!resaurant || !role)
    throw {
      httpCode: 400,
      message: 'req.body should have keys "resaurant" and "role".',
    }
  if (!isValidObjectId(resaurant))
    throw {
      httpCode: 400,
      message: `${resaurant} is not a valid MongoDb objectId.`,
    }
  if (!isValidRole(role) || role === roles.owner)
    throw {
      httpCode: 400,
      message: `${role} is not a valid role.`,
    }
  return { resaurant, role, userId: user._id }
}

/* 
basic design:
- Owner is the one who create this restaurant. It can only changed by website owner. 
- Manager is the one has almost same permision as owner, except inviting/deleting manager
- Owner/manager can invite anyone become a staff. 
*/

/*
* [ ] manager can read his staff's basic infomation. such as name, picture etc.
      Get '/restaurants/restaurantId/staff/'
*/
readStaff = async (req, res, next) => {}

// Post '/restaurants/restaurantId/staff/'
/*
*   [ ] Manger can send invitation to user (by email adress)
    *   [ ] Post '/restaurants/restaurantId/staff/'
        { email, role }
          => validate( User.find({email:email}) exists )
              .then( user.servingInvitations.push(role)  )
              .catch(send error)
    > manager cannot cancel invitation. but invitation will be expired in 1 d.
*/
inviteStaff = async (req, res, next) => {}

/*
  *   [ ] manager can remove staff
    *   [ ] Delete '/restaurants/restaurantId/staff/'
         *   - role is not manager, nor owner    
    *   [ ] Delete '/restaurants/restaurantId/manager/'
        *   - role is manager
        { userId, role }
          => validate( 
              - User.find({_id:userId}) exists 
              - check url with role
            )
            .then(
              if (!restaurant.userGroups[role].includes(user._id)) {
                restaurant.userGroups[role].remove(user._id)
              })
            .catch(blabla)
*/
deleteStaff = async (req, res, next) => {}
// terminateStaff
