const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const authIo = require('socketio-auth')
const port = process.env.PORT || 8000

const onConnection = (client) => {
  console.log('User ' + client.id + ' connected!')
  client.on('disconnect', () => {
    console.log('User ' + client.id + ' disconnected!')
  })
}

// TODO: authentication
const authenticate = async (client, data, callback) => {
  const { userId, password } = data
  try {
    const user = await User.findOne({ userId })
    callback(null, user && user.validPassword(password))
  } catch (error) {
    callback(error)
  }
}

const postAuthenticate = (socket, data) => {
  const { restaurantId, userId, userType } = data

  db.findUser('User', { userId: userId }, function (err, user) {
    socket.client.user = user
  })

  //1. create room based on restaurantId and usertype
  const room = restaurantId + userType
}

function disconnect(socket) {
  console.log(socket.id + ' disconnected')
}

authIo(io, {
  authenticate: authenticate,
  postAuthenticate: postAuthenticate,
  disconnect: disconnect,
  timeout: 1000,
})

http.listen(port, function () {
  console.log('listening on *:' + port)
})
