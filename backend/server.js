const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const PORT = 5000

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
let fakeData = {
  dishes: [
    {
      _id: 0,
      name: 'Lamb',
      readyTime: '15:08:31',
      tableId: 10,
      orderId: 'o0',
      state: 'READY',
      serveTime: null,
    },
    {
      _id: 1,
      name: 'Chicken',
      readyTime: '20:49:03',
      tableId: 1,
      orderId: 'o1',
      state: 'READY',
      serveTime: null,
    },
    {
      _id: 2,
      name: 'Coffee',
      readyTime: '16:52:20',
      tableId: 2,
      orderId: 'o2',
      state: 'READY',
      serveTime: null,
    },
    {
      _id: 3,
      name: 'Beef',
      readyTime: '16:14:11',
      tableId: 1,
      orderId: 'o3',
      state: 'READY',
      serveTime: null,
    },
    {
      _id: 4,
      name: 'Burger',
      readyTime: '14:10:33',
      tableId: 5,
      orderId: 'o4',
      state: 'READY',
      serveTime: null,
    },
    {
      _id: 5,
      name: 'Chicken',
      readyTime: '14:57:22',
      tableId: 4,
      orderId: 'o5',
      state: 'READY',
      serveTime: null,
    },
    {
      _id: 6,
      name: 'Egg',
      readyTime: '18:10:48',
      tableId: 7,
      orderId: 'o6',
      state: 'READY',
      serveTime: null,
    },
    {
      _id: 7,
      name: 'Burger',
      readyTime: '16:12:33',
      tableId: 10,
      orderId: 'o7',
      state: 'READY',
      serveTime: null,
    },
    {
      _id: 8,
      name: 'Egg',
      readyTime: '16:33:07',
      tableId: 8,
      orderId: 'o8',
      state: 'READY',
      serveTime: null,
    },
    {
      _id: 9,
      name: 'Chicken',
      readyTime: '14:07:20',
      tableId: 10,
      orderId: 'o9',
      state: 'READY',
      serveTime: null,
    },
    {
      _id: 10,
      name: 'Beef',
      readyTime: '14:33:41',
      tableId: 6,
      orderId: 'o10',
      state: 'READY',
      serveTime: null,
    },
    {
      _id: 11,
      name: 'Coke',
      readyTime: '19:18:18',
      tableId: 4,
      orderId: 'o11',
      state: 'READY',
      serveTime: null,
    },
    {
      _id: 12,
      name: 'Lamb',
      readyTime: '16:16:47',
      tableId: 2,
      orderId: 'o12',
      state: 'READY',
      serveTime: null,
    },
    {
      _id: 13,
      name: 'Coke',
      readyTime: '17:07:27',
      tableId: 5,
      orderId: 'o13',
      state: 'READY',
      serveTime: null,
    },
    {
      _id: 14,
      name: 'Egg',
      readyTime: '17:46:57',
      tableId: 4,
      orderId: 'o14',
      state: 'READY',
      serveTime: null,
    },
    {
      _id: 15,
      name: 'Coke',
      readyTime: '20:51:38',
      tableId: 9,
      orderId: 'o15',
      state: 'READY',
      serveTime: null,
    },
    {
      _id: 16,
      name: 'Beef',
      readyTime: '18:05:03',
      tableId: 5,
      orderId: 'o16',
      state: 'READY',
      serveTime: null,
    },
    {
      _id: 17,
      name: 'Apple',
      readyTime: '15:07:20',
      tableId: 7,
      orderId: 'o17',
      state: 'READY',
      serveTime: null,
    },
    {
      _id: 18,
      name: 'Egg',
      readyTime: '15:00:28',
      tableId: 6,
      orderId: 'o18',
      state: 'READY',
      serveTime: null,
    },
    {
      _id: 19,
      name: 'Lamb',
      readyTime: '20:07:08',
      tableId: 4,
      orderId: 'o19',
      state: 'READY',
      serveTime: null,
    },
  ],
  requests: [
    { _id: 0, receiveTime: '14:42:25', tableId: 9, finishTime: null },
    { _id: 1, receiveTime: '17:30:01', tableId: 10, finishTime: null },
    { _id: 2, receiveTime: '18:21:50', tableId: 7, finishTime: null },
    { _id: 3, receiveTime: '15:17:37', tableId: 5, finishTime: null },
    { _id: 4, receiveTime: '20:40:08', tableId: 4, finishTime: null },
    { _id: 5, receiveTime: '14:25:00', tableId: 8, finishTime: null },
    { _id: 6, receiveTime: '17:46:55', tableId: 10, finishTime: null },
    { _id: 7, receiveTime: '20:58:58', tableId: 2, finishTime: null },
    { _id: 8, receiveTime: '17:28:27', tableId: 3, finishTime: null },
    { _id: 9, receiveTime: '17:32:58', tableId: 2, finishTime: null },
    { _id: 10, receiveTime: '18:28:39', tableId: 9, finishTime: null },
    { _id: 11, receiveTime: '20:31:29', tableId: 6, finishTime: null },
    { _id: 12, receiveTime: '19:51:34', tableId: 10, finishTime: null },
    { _id: 13, receiveTime: '14:02:31', tableId: 5, finishTime: null },
    { _id: 14, receiveTime: '16:33:30', tableId: 8, finishTime: null },
    { _id: 15, receiveTime: '14:09:16', tableId: 1, finishTime: null },
    { _id: 16, receiveTime: '16:06:34', tableId: 8, finishTime: null },
    { _id: 17, receiveTime: '14:34:52', tableId: 4, finishTime: null },
    { _id: 18, receiveTime: '14:42:37', tableId: 5, finishTime: null },
    { _id: 19, receiveTime: '14:51:22', tableId: 3, finishTime: null },
  ],
}

const { dishes, requests } = fakeData

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

http.listen(PORT, function () {
  console.log('Websocket listening at ' + PORT)
})

module.exports = http
