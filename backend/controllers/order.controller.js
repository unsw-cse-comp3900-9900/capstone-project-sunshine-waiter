const Joi = require('joi')
const Order = require('../models/order.model')
const _ = require('lodash')

/*
1. validate input
2. if valid: create new object with input; save it;
3. response 
*/
createOrder = async (req, res, next) => {
  try {
    const { restaurantId } = req.params
    {
      menuItem, amount, configuration
    }
    // if any error
    res.status(404).json({ error: `Object ot found. id: ${id}` })
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
