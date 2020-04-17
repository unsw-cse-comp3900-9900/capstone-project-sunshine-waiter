const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const { canConnectToRestaurant } = require('./auth')
const serverRules = require('./serverRules')
const PORT = 5000

const nsps = {}

const authenticate = async (socket, next) => {
  let { jwt, restaurantId } = socket.handshake.query

  try {
    const { userId } = await canConnectToRestaurant(jwt, restaurantId)
    if (userId) next()
  } catch (err) {
    return next(err)
  }
}

const onConnection = (authenticatedClient) => {
  let { restaurantId } = authenticatedClient.handshake.query
  const nspName = '/' + restaurantId
  authenticatedClient.emit('authenticate success', nspName)
  if (!nsps[restaurantId]) {
    //create new nsp
    const nsp = io.of(nspName)
    nsp.on('connect', serverRules(nsp))
    nsps[restaurantId] = nsp
  }
}

io.use(authenticate) // middle ware to check user's auth
io.on('connect', onConnection)

http.listen(PORT, function () {
  console.log('Websocket listening at ' + PORT)
})

module.exports = http
