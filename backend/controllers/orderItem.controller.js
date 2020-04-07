const Joi = require('joi')
const _ = require('lodash')
const mongoose = require('mongoose')
const isValid = require('mongoose').Types.ObjectId.isValid
const { OrderItem, allowedStatus } = require('../models/orderItem.model')
const MenuItem = require('../models/menuItem.model')
const { findMenu } = require('./menu.controller')
const { findOrder } = require('./order.controller')
const { present } = require('../util')

/*
precond:
- on every menuItemId from req.orderItemsData, exist menuItem in DB with such id 
*/
createOrderItems = async (req, res, next, order) => {
  try {
    await validateOrderItemsData(req, res, next)

    const { orderItemsData, placedBy } = req.body
    const docs = orderItemsData.map((orderItemData) => {
      return {
        ..._.pick(orderItemData, [
          'menuItem',
          'price',
          'name',
          'amount',
          'notes',
        ]),
        order: order._id,
        placedBy,
      }
    })
    await OrderItem.create(docs)
  } catch (error) {
    next(error)
  }
}

validateOrderItemsData = async (req, res, next) => {
  const { placedBy } = req.body

  // Incomplete, not including checkInteger(amount) , checkObjectId(menuItem)
  const basicSchema = {
    name: Joi.string().max(50).required(),
    price: Joi.number().required(),
    amount: Joi.number().integer().positive().required(),
    notes: Joi.string().max(255),
    placedBy: Joi.string().max(255),
  }

  const validateBasic = (orderItemData) => {
    const data = {
      ..._.pick(orderItemData, ['price', 'name', 'amount', 'notes']),
      placedBy,
    }
    const { error } = Joi.validate(data, basicSchema)

    if (error) {
      throw {
        resCode: 400,
        message: error.details[0].message,
        problematicData: orderItemData,
      }
    }
  }

  const currentMenu = await findMenu(req, res)
  const validateMenuItemRef = async (orderItemData) => {
    const objectId = orderItemData.menuItem

    const isValid = mongoose.Types.ObjectId.isValid
    if (!isValid(objectId)) {
      throw {
        resCode: 400,
        message: `${objectId} is not a valid objectId.`,
        problematicData: orderItemData,
      }
    }

    const menuItem = await MenuItem.findById(objectId)

    if (!menuItem || !currentMenu._id.equals(menuItem.menu)) {
      throw {
        resCode: 400,
        message: `Menuitem ${objectId} not found. It is not refering to an existing menuItem in target restaurant.`,
        problematicData: orderItemData,
      }
    }
  }

  try {
    const { orderItemsData } = req.body
    if (!Array.isArray(orderItemsData) || !orderItemsData.length) {
      throw {
        resCode: 400,
        message:
          'Request body shall contain orderItemsData. It is an array containing data for creating orderItems.',
      }
    }

    orderItemsData.forEach((orderItemData) => {
      validateBasic(orderItemData)
    })

    const validatePromises = orderItemsData.map((orderItemData) =>
      (async () => await validateMenuItemRef(orderItemData))()
    )
    await Promise.all(validatePromises)
    return
  } catch (error) {
    next(error)
  }
}

/*
precond:
exist order with req.params.orderId 
*/
readItemsInOrder = async (req, res, next) => {
  const order = await findOrder(req, res, next)
  const objs = await OrderItem.find({ order: order._id })
  res.json({ data: objs.map((v) => present(v)) })
}

/*
return 
- { error: String } when fail
- { success: true } when success
*/
updateItemStatus = async (restaurantId, itemId, newStatus) => {
  if (!allowedStatus[newStatus])
    return { error: `newStatus ${newStatus} is not valid` }

  const item = await findItem(restaurantId, itemId)
  item.status = newStatus
  await item.save()
  return { success: true }
}

findItem = async (restaurantId, itemId) => {
  if (!itemId || !isValid(itemId))
    return { error: `itemId ${itemId} is not valid` }
  if (!restaurantId || !isValid(restaurantId))
    return { error: `restaurantId ${restaurantId} is not valid` }
  const item = await OrderItem.findById(itemId)
  if (!item) return { error: `orderItem ${itemId} not found` }
  const order = await Order.findById(item.order)
  if (!order) return { error: `order not found` }
  if (!order.restaurant.equals(restaurantId))
    return { error: `item ${itemId} is not in current restaurant!` }
  return item
}

module.exports = {
  createOrderItems,
  readItemsInOrder,
}
