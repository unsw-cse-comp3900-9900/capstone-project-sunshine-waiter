const MenuItem = require('../models/menuItem.model')
const { nsps, createNewServer } = require('../webSocket.server/server')
const Order = require('../models/order.model')
const serverRules = require('../webSocket.server/serverRules')

const sendOrderItems = async (orderItemRecords) => {
  const orderItems = await Promise.all(orderItemRecords.map(enrichOrderItem))
  const { restaurant: restaurantId } = orderItems[0]
  if (!nsps[restaurantId]) {
    nsps[restaurantId] = createNewServer('/' + restaurantId, serverRules)
  }
  for (let orderItem of orderItems)
    nsps[restaurantId].to('cook').emit('update dish', orderItem)
}

async function enrichOrderItem(orderItemRecord) {
  let orderItem = { ...orderItemRecord._doc }

  const { order: orderId } = orderItem

  const order = await Order.findById(orderId)

  orderItem.order = order
  return orderItem
}

module.exports = { sendOrderItems, enrichOrderItem }
