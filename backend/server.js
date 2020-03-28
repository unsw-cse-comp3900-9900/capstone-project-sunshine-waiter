const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 8000

let { fakeData } = require('../frontend/src/components/Waiter/fakeData.js')
let { dishes, requests } = fakeData

var nsps = {}

const arrayToObj = (array) => {
  let result = {}
  for (let item of array) {
    result[item._id] = item
  }
  return result
}

dishes = arrayToObj(dishes)
requests = arrayToObj(requests)

const onConnection = (anonymousClient) => {
  console.log('Unknow User ' + anonymousClient.id + ' connected!')

  anonymousClient.on('authenticate', (data) => {
    const { restaurantId, userId, userType, password } = data

    //skip authenticate
    var auth = true

    if (auth) {
      console.log(userType + ' ' + userId + ' authenticated!')
      const nspName = '/' + restaurantId
      anonymousClient.emit('authenticate success', nspName) // send nsp to authenticated client
      if (!nsps[restaurantId]) {
        const nsp = io.of(nspName) // create safe connect
        nsp.on('connect', (socket) => {
          console.log(userType + ' ' + userId + ' connect to ' + restaurantId)
          socket.join(userType) // put user into rooms according to their type
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
          })
          socket.on('update request', (request) => {
            // update db
            console.log(request)
            requests[request._id] = request
            nsp.to('waiter').emit('update request', request)
          })
          socket.on('disconnect', () => {
            console.log(
              userType + ' ' + userId + ' disconnect to ' + restaurantId
            )
          })

          // initiate data
          socket.emit('initiate data', dishes, requests)
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

exports = http.listen(port, function () {
  console.log('listening on *:' + port)
})
