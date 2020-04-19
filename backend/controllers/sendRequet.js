const sendRequest = async (requestRecord) => {
  const { nsps, createNewServer } = require('../webSocket.server/server')
  const serverRules = require('../webSocket.server/serverRules')
  const request = { ...requestRecord._doc }

  const { restaurant: restaurantId } = request
  if (!nsps[restaurantId]) {
    nsps[restaurantId] = createNewServer('/' + restaurantId, serverRules)
  }
  nsps[restaurantId].to('waiter').emit('update request', request)
}

module.exports = { sendRequest }
