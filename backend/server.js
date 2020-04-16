const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const PORT = 5000
const Restaurant = require('./models/restaurant.model')

const author = require('./auth/authorization')

const arrayToObj = (array) => {
  let result = {}
  for (let item of array) {
    result[item._id] = item
  }
  return result
}
const nsps = {}
// dishes = arrayToObj(dishes)
// requests = arrayToObj(requests)

const isGranted = (userId, restaurant, action, resource) => {
  const userGroups = restaurant.userGroups

  for (let [roleType, userIdArray] of Object.entries(userGroups)) {
    if (
      userGroups.hasOwnProperty(roleType) && // skip inherited properties. e.g "$init"
      Array.isArray(userIdArray) &&
      userIdArray.includes(userId) && // current user has the role
      ac.can(roleType)[action + 'Own'](resource).granted // the role has the permission
    ) {
      return true
    }
  }
  return false
}

const { dishes, requests } = require('./fakeData')

const onConnection = (anonymousClient) => {
  console.log('Unknow User ' + anonymousClient.id + ' connected!')

  anonymousClient.on('authenticate', async (data) => {
    const { jwt, restaurantId, _id, type, password } = data

    // validate user input
    const { userId, error } = getIdFromJWT(jwt)
    if (error) {
      //reject
    }
    const { restaurant } = await Restaurant.findById(restaurantId)
    if (!restaurant) {
      //reject
    }
    const canConnectToRestaurant = true // to be discussed

    const canAccessCook = isGranted(
      userId,
      restaurant,
      author.actions.update,
      author.resource.cooking_queue
    )
    const canAccessWaiter = isGranted(
      userId,
      restaurant,
      author.actions.update,
      author.resource.serving_queue
    )
    const canAccessorder = isGranted(
      userId,
      restaurant,
      author.actions.update,
      author.resource.order
    )

    // assume steve is manager
    if (canConnectToRestaurant) {
      console.log(type + ' ' + _id + ' authenticated!')
      // start connection
      {
        if (canAccessCook) {
          // true
          // add listener on cook update
        }
        if (canAccessWaiter) {
          // true
          // add listener on waiter update
        }
        if (canAccessorder) {
          // true
          // add listener on order update
        }
      }
    }

    //skip authenticate
    var auth = true

    if (auth) {
      console.log(type + ' ' + _id + ' authenticated!')
      const nspName = '/' + restaurantId
      anonymousClient.emit('authenticate success', nspName) // send nsp to authenticated client
      if (!nsps[restaurantId]) {
        const nsp = io.of(nspName) // create safe connect
        nsp.on('connect', (socket) => {
          // do sth like first time.
          // listener.on('new order placed', (order) => {
          //   nsp.to('cook').emit('update dish queue', queue)
          // })

          console.log(type + ' ' + _id + ' connect to ' + restaurantId)
          socket.join(type) // put user into rooms according to their type
          socket.on('dish cooked', (dish) => {
            // new dish cooked from kitchen, need to send to waiter
            // skip recording to db
            nsp.to('waiter').emit('update dish', dish)
          })
          socket.on('new request', (request) => {
            // new request from customer need to send to waiter
            nsp.to('waiter').emit('update request', request)
          })
          socket.on('update dish', (dish) => {
            // dish served or fail send from waiter, server need to update the db
            // update db
            console.log(dish)
            dishes[dish._id] = dish
            nsp.to('waiter').emit('update dish', dish) // let all other waiter know
            nsp.to('cook').emit('update dish', dish)
          })
          socket.on('update request', (request) => {
            // update db
            console.log(request)
            requests[request._id] = request
            nsp.to('waiter').emit('update request', request)
          })
          socket.on('disconnect', () => {
            console.log(type + ' ' + _id + ' disconnect to ' + restaurantId)
          })

          // initiate data
          switch (type) {
            case 'cook':
              socket.emit('initiate data', dishes)
              break
            case 'waiter':
              socket.emit('initiate data', dishes, requests)
              break
            default:
          }
        })
        nsps[restaurantId] = nsp
      }
    }
  })
  anonymousClient.on('disconnect', () => {
    console.log('User ' + anonymousClient.id + ' disconnected!')
  })
}

io.on('connect', onConnection)

http.listen(PORT, function () {
  console.log('Websocket listening at ' + PORT)
})

module.exports = http
