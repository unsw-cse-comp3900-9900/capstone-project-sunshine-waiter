const { updateItem } = require('../controllers/orderItem.controller')
const { requests } = require('./fakeData')
const { OrderItem } = require('../models/orderItem.model')

const serverRules = (nsp) => {
  return async (socket) => {
    let { restaurantId, _id: userId, type } = socket.handshake.query
    console.log(`${type} ${userId} connected to restaurant ${restaurantId}`)
    socket.join(type) // put user into rooms according to their type
    socket.on('update dish', async (item) => {
      // dish served or fail send from waiter, server need to update the db
      let itemRecord = { ...item }
      itemRecord.order = item.order._id
      itemRecord.menuItem = item.menuItem._id
      if (item.cookedBy && item.cookedBy._id)
        itemRecord.cookedBy = item.cookedBy._id
      if (item.servedBy && item.servedBy._id)
        itemRecord.servedBy = item.servedBy._id

      await updateItem(restaurantId, itemRecord)

      nsp.to('waiter').emit('update dish', item) // let all other waiter know
      nsp.to('cook').emit('update dish', item)
    })

    socket.on('update request', (request) => {
      // update db

      nsp.to('waiter').emit('update request', request)
    })
    socket.on('disconnect', () => {
      console.log(
        type + ' ' + userId + ' disconnect to restaurnat ' + restaurantId
      )
    })

    // initiate with dummy data
    const { enRichData } = require('../controllers/sendOrderItem')
    let orderItems = await OrderItem.find({ restaurant: restaurantId })
    orderItems = await Promise.all(
      orderItems
        .filter((_) => _.status !== 'SERVED' && _.status !== 'FAILED')
        .map(enRichData)
    )

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
