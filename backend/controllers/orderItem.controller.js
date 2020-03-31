const Joi = require('joi')
const _ = require('lodash')

const Order = require('../models/order.model')
const { findMenu } = require('./menu.controller')

// present data to client side
const present = (obj) => {
  const { __v, ...data } = obj._doc
  return data
}

// create order { name, price, description, note  }
createOrder = async (req, res, next) => {
  try {
    // validate input ( params, body )
    const { error } = validateCreateDataFormat(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })
    const menu = await findMenu(req, res)

    // create order
    order = new Order({
      ..._.pick(req.body, ['name', 'price', 'description', 'note']),
      menu: menu._id,
    })
    await order.save()

    res.status(201).json({ data: present(order) })
  } catch (error) {
    next(error)
  }
}

readOrder = async (req, res, next) => {
  try {
    // find
    const orderId = req.params.orderId
    const order = await Order.findById(orderId)
    if (!order) return res.status(404).json({ error: 'Order does not exist' })

    // res
    res.status(201).json({ data: present(order) })
  } catch (error) {
    next(error)
  }
}

readMany = async (req, res, next) => {
  try {
    const menu = await findMenu(req, res)
    const orders = await Order.find({ menu: menu._id })

    res.json({ data: orders.map((v) => present(v)) })
  } catch (error) {
    next(error)
  }
}

// update scope: { name, description }
updateOrder = async (req, res, next) => {
  try {
    // find
    const orderId = req.params.orderId
    const order = await Order.findById(orderId)
    if (!order) return res.status(404).json({ error: 'Order does not exist' })

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
      message: 'Order updated.',
    })
  } catch (error) {
    next(error)
  }
}

deleteOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId
    const order = await Order.findById(orderId)
    if (!order)
      return res
        .status(204)
        .send('Order has been deleted or does not exist at all.')

    await Order.findByIdAndDelete(orderId)

    return res.json({
      success: true,
      data: present(order),
      message: 'Order deleted.',
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
  }

  return Joi.validate(order, schema)
}

module.exports = {
  createOrder,
  readOrder,
  updateOrder,
  deleteOrder,
  readMany,
  deleteMany,
}
