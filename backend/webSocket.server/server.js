const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const { canConnectToRestaurant } = require('./auth')
const serverRules = require('./serverRules')
const PORT = 5000

const nsps = {}

const onConnection = (anonymousClient) => {
  console.log('Unknow User ' + anonymousClient.id + ' connected!')

  anonymousClient.on('authenticate', async (data) => {
    const { jwt, restaurantId, type } = data
    try {
      const { userId, restaurant } = await canConnectToRestaurant(
        jwt,
        restaurantId
      )

      // assume steve is manager
      if (userId) {
        // start connection
        const nspName = '/' + restaurantId
        anonymousClient.emit('authenticate success', nspName) // send nsp to authenticated client
        if (!nsps[restaurantId]) {
          const nsp = io.of(nspName)
          nsp.on('connect', serverRules(nsp, userId, restaurant, type))
          nsps[restaurantId] = nsp
        }
      }
    } catch (error) {
      anonymousClient.close()
    }
  })
  anonymousClient.on('disconnect', () => {
    console.log('UnKnown User ' + anonymousClient.id + ' disconnected!')
  })
}

io.on('connect', onConnection)

http.listen(PORT, function () {
  console.log('Websocket listening at ' + PORT)
})

module.exports = http
