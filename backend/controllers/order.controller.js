const Joi = require('joi')
const Order = require('../models/order.model')
const _ = require('lodash')
const { findRestaurant } = require('.restaurant.controller')
const { createOrderItems } = require('./orderItem.controller')
// present data to client side
const present = (obj) => {
  const { __v, createdBy, ...data } = obj._doc
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
    const placedBy = req.placedBy
    if (!placedBy)
      throw { resCode: 400, message: 'Request body miss key: placeBy' }
    const restaurant = await findRestaurant(req, res, next)
    const order = new Order({
      placedBy,
      isPayed: false,
      isAllServed: false,
      createdAt: new Date(),
      restaurant: restaurant._id,
      orderItems: [],
    })

    const { orderItemIds } = await createOrderItems(req, res, next, order)

    order.orderItems = orderItemIds

    await order.save()
    res.status(201).json({ data: present(order) })
  } catch (error) {
    next(error)
  }
}

function validateCreateDataFormat(order) {
  const schema = {
    name: Joi.string().min(1).max(50),
    description: Joi.string().min(1).max(2047),
  }

  return Joi.validate(order, schema)
}

readOrder = async (req, res, next) => {
  try {
    const { orderId: id } = req.params
    const obj = await Order.findById(id)
    if (obj) {
      res.json({ data: obj })
    } else {
      res.status(404).json({ error: `Object ot found. id: ${id}` })
    }
  } catch (error) {
    next(error)
  }
}

// update scope: { name, description }
updateOrder = async (req, res, next) => {
  try {
    // validate new data

    // update&save
    obj.name = name || obj.name
    obj.description = description || obj.description
    await obj.save()

    // res
    return res.json({
      success: true,
      data: obj,
      message: 'Order updated.',
    })
  } catch (error) {
    next(error)
  }
}

function validateUpdateDataFormat(order) {
  const schema = {
    name: Joi.string().min(1).max(50),
    description: Joi.string().min(1).max(2047),
  }

  return Joi.validate(order, schema)
}

module.exports = {
  createOrder,
  readOrder,
  updateOrder,
}
