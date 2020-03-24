const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 8000

const fakeNewDish = {
  _id: 'djieq34q569r',
  name: 'egg',
  readyTime: new Date(),
  tableId: 't28',
  orderId: 'fdafr89891ruq',
  state: 'READY', //canbe SERVED or FAIL
  serveTime: null,
}

var nsps = {}

const onConnection = (client) => {
  console.log('Unknow User ' + client.id + ' connected!')

  client.on('authenticate', (data) => {
    const { restaurantId, userId, userType, password } = data

    //skip authenticate
    var auth = true

    if (auth) {
      console.log(userType + ' ' + userId + ' authenticated!')
      const nsp = io.of('/' + restaurantId) // create safe connect
      client.emit('authenticate success', nsp.name)
      nsp.on('connect', (socket) => {
        console.log(userType + ' ' + userId + ' connect to ' + restaurantId)
        socket.join(userType) // put user into rooms according to their type
        socket.on('dish cooked', (dish) => {
          // new dish cooked from kitchen, need to send to waiter
          // skip recording to db
          nsp.to('waiter').emit('new dish', dish)
        })
        socket.on('new request', (request) => {
          // new request from customer need to send to waiter
          nsp.to('waiter').emit('new request', request)
        })
        socket.on('update dish', (dish) => {
          // dish served or fail send from waiter, server need to update the db
          // update db
        })
        socket.on('update request', (request) => {
          // update db
        })
        socket.on('disconnect', () => {
          console.log(
            userType + ' ' + userId + ' disconnect to ' + restaurantId
          )
        })

        // test
        nsp.to('waiter').emit('new dish', fakeNewDish)
      })
      nsps[restaurantId] = nsp
    }
  })
  client.on('disconnect', () => {
    console.log('User ' + client.id + ' disconnected!')
  })
}

io.on('connect', onConnection)

http.listen(port, function () {
  console.log('listening on *:' + port)
})
