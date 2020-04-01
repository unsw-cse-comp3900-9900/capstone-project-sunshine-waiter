const Joi = require('joi')
const _ = require('lodash')

const OrderItem = require('../models/orderItem.model')
const { findMenu } = require('./menu.controller')

// present data to client side
const present = (obj) => {
  const { __v, ...data } = obj._doc
  return data
}

// create order { name, price, description, note  }
createOrderItem = async (req, res, next) => {
  try {
    // validate input ( params, body )
    const { error } = validateCreateDataFormat(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })
    const menu = await findMenu(req, res)

    // create order
    order = new OrderItem({
      ..._.pick(req.body, ['name', 'price', 'description', 'note']),
      menu: menu._id,
    })
    await order.save()

    res.status(201).json({ data: present(order) })
  } catch (error) {
    next(error)
  }
}

readOrderItem = async (req, res, next) => {
  try {
    // find
    const orderId = req.params.orderId
    const order = await OrderItem.findById(orderId)
    if (!order)
      return res.status(404).json({ error: 'OrderItem does not exist' })

    // res
    res.status(201).json({ data: present(order) })
  } catch (error) {
    next(error)
  }
}

readMany = async (req, res, next) => {
  try {
    const menu = await findMenu(req, res)
    const orders = await OrderItem.find({ menu: menu._id })

    res.json({ data: orders.map((v) => present(v)) })
  } catch (error) {
    next(error)
  }
}

// update scope: { name, description }
updateOrderItem = async (req, res, next) => {
  try {
    // find
    const orderId = req.params.orderId
    const order = await OrderItem.findById(orderId)
    if (!order)
      return res.status(404).json({ error: 'OrderItem does not exist' })

    // validate new data
    const { name, description } = req.body
    const { error } = validateUpdateDataFormat({ name, description })
    if (error) return res.status(400).json({ error: error.details[0].message })

    // update
    order.name = name || order.name
    order.description = description || order.description
    await order.save()

    // res
    return res.json({
      success: true,
      data: present(order),
      message: 'OrderItem updated.',
    })
  } catch (error) {
    next(error)
  }
}

deleteOrderItem = async (req, res, next) => {
  try {
    const orderId = req.params.orderId
    const order = await OrderItem.findById(orderId)
    if (!order)
      return res
        .status(204)
        .send('OrderItem has been deleted or does not exist at all.')

    await OrderItem.findByIdAndDelete(orderId)

    return res.json({
      success: true,
      data: present(order),
      message: 'OrderItem deleted.',
    })
  } catch (error) {
    next(error)
  }
}

deleteMany = async (req, res, next) => {
  try {
    const id_list = req.body.items
    return res.json({
      success: false,
      message: `DeleteMany is not yet implemented. You can perform Delete on each id of ${id_list}`,
    })
  } catch (error) {
    next(error)
  }
}

/*
ret: 
- new object if success
- { error: 'error messsage' } if fail
*/
updateStatus = async (id, dataToUpdate) => {
  try {
    // 1. validtate input
    const orderItem = await OrderItem.findById(id)
    if (!orderItem) {
      // const ret = {error : `orderItem ${id} not found`}
    }
    const { error } = validateUpdateDataFormat(dataToUpdate)

    // 2. update data
    await updateItem(dataToUpdate)

    // 3. return data
  } catch (error) {
    return error
  }
}

function validateCreateDataFormat(order) {
  const schema = {
    name: Joi.string().max(50).required(),
    price: Joi.number().required(),
    description: Joi.string().max(2047),
    note: Joi.string().max(255),
  }

  return Joi.validate(order, schema)
}

function validateUpdateDataFormat(order) {
  const schema = {
    name: Joi.string().min(1).max(50),
    description: Joi.string().min(1).max(2047),
    // TODO:  serveTime
  }

  return Joi.validate(order, schema)
}

module.exports = {
  createOrderItem,
  readOrderItem,
  updateOrderItem,
  deleteOrderItem,
  readMany,
  deleteMany,
  updateStatus,
}
