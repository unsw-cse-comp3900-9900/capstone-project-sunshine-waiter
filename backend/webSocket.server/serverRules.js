const { updateItem } = require('../controllers/orderItem.controller')
// const { requests } = require('./fakeData')
const { updateRequest } = require('../controllers/request.controller')
const { OrderItem } = require('../models/orderItem.model')
const Request = require('../models/request.model')

const serverRules = (nsp) => {
  return async (socket) => {
    let { restaurantId, _id: userId, type } = socket.handshake.query
    console.log(`${type} ${userId} connected to restaurant ${restaurantId}`)
    socket.join(type) // put user into rooms according to their type
    socket.on('update dish', async (item) => {
      // dish served or fail send from waiter, server need to update the db
      let itemRecord = { ...item }
      if (item.cookedBy && item.cookedBy._id)
        itemRecord.cookedBy = item.cookedBy._id
      if (item.servedBy && item.servedBy._id)
        itemRecord.servedBy = item.servedBy._id

      await updateItem(restaurantId, itemRecord)

      nsp.to('waiter').emit('update dish', item) // let all other waiter know
      nsp.to('cook').emit('update dish', item)
    })

    socket.on('update request', async (request) => {
      let requestRecord = { ...request }
      if (request.handleBy && request.handleBy._id)
        requestRecord.handleBy = request.handleBy._id

      // update db
      await updateRequest(restaurantId, requestRecord)
      nsp.to('waiter').emit('update request', request)
    })
    socket.on('disconnect', () => {
      console.log(
        type + ' ' + userId + ' disconnect to restaurnat ' + restaurantId
      )
    })

    // initiate with data in db
    const { enrichOrderItem } = require('../controllers/sendOrderItem')
    let orderItems = await OrderItem.find({ restaurant: restaurantId })
    orderItems = await Promise.all(
      orderItems
        .filter((_) => _.status !== 'SERVED' && _.status !== 'FAILED')
        .map(enrichOrderItem)
    )

    let requests = await Request.find({ restaurant: restaurantId })
    requests = await Promise.all(requests.filter((_) => _.finishTime === null))

    switch (type) {
      case 'cook':
        socket.emit('initiate data', orderItems)
        break
      case 'waiter':
        socket.emit('initiate data', orderItems, requests)
        break
      default:
    }
  }
}

module.exports = serverRules
