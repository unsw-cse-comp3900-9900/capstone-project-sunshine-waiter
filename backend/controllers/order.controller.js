const Order = require('../models/order.model')
const { OrderItem, allowedStatus } = require('../models/orderItem.model')

const { findRestaurant } = require('./restaurant.controller')
const { createOrderItems } = require('./orderItem.controller')

const _ = require('lodash')
const isValid = require('mongoose').Types.ObjectId.isValid
const { present: presentDoc } = require('../util')
const { sendOrderItems } = require('./sendOrderItem')

const present = async (order) => {
  const obj = presentDoc(order)
  const items = await OrderItem.find({ order: order._id })
  const data = { ...obj, items }
  return data
}

/*
1. validate input
2. if valid: create new object with input; save it;
3. response 

precond: 
- exist restaurant in DB with req.restaurantId
- on every menuItemId from req.orderItemsData, exist menuItem in DB with such id 
*/
createOrder = async (req, res, next) => {
  try {
    const { placedBy } = req.body
    if (!placedBy)
      throw { httpCode: 400, message: 'Request body miss key: placedBy' }
    const restaurant = await findRestaurant(req)

    const order = new Order({
      placedBy,
      isPaid: false,
      isAllServed: false,
      createdAt: new Date(),
      restaurant: restaurant._id,
      orderItems: [],
    })
    await order.save()

    const orderItems = await createOrderItems(req, res, next, order)
    sendOrderItems(orderItems) // send to websocket server
    res.status(201).json({ data: await present(order) })
  } catch (error) {
    next(error)
  }
}

readOrder = async (req, res, next) => {
  try {
    const order = await findOrder(req, res, next)
    res.json({ data: await present(order) })
  } catch (error) {
    next(error)
  }
}

readMany = async (req, res, next) => {
  try {
    const restaurant = await findRestaurant(req)
    const objs = await Order.find({ restaurant: restaurant._id })

    const tasks = objs.map((o) => (async () => await present(o))())
    const mappedRuslt = await Promise.all(tasks)

    res.json({ data: mappedRuslt })
  } catch (error) {
    next(error)
  }
}

updatePaymentStatus = async (req, res, next) => {
  try {
    const { isPaid, obj } = await validatePaymentStatus(req, res, next)
    obj.isPaid = isPaid
    await obj.save()

    return res.status(204).json({
      success: true,
      message: 'Order updated.',
    })
  } catch (error) {
    next(error)
  }
}
validatePaymentStatus = async (req, res, next) => {
  try {
    const { isPaid } = req.body
    if (typeof isPaid !== 'boolean')
      return res.status(400).json({ error: 'Boolean "isPaid" is required.' })

    const obj = await findOrder(req, res, next)
    return { isPaid, obj }
  } catch (error) {
    next(error)
  }
}

updateServedStatus = async (orderId) => {
  try {
    const order = await Order.findById(orderId)

    await order.orderItems.forEach(async (orderItem) => {
      if (
        orderItem.status != allowedStatus.SERVED &&
        orderItem.status != allowedStatus.FAIL
      ) {
        order.isAllServed = false
        await order.save()
        return { isAllServed: false }
      }
    })

    order.isAllServed = true
    await order.save()
    return { isAllServed: true }
  } catch (error) {
    return error
  }
}

// util
findOrder = async (req, res, next) => {
  const { orderId } = req.params
  if (!orderId || !isValid(orderId))
    return res.status(400).json({ error: 'orderId is not valid' })

  const obj = await Order.findById(orderId)
  if (!obj)
    return res.status(404).json({ error: `Order ${orderId} not found.` })

  return obj
}

module.exports = {
  createOrder,
  readOrder,
  readMany,
  updatePaymentStatus,
  updateServedStatus,
  findOrder,
}
