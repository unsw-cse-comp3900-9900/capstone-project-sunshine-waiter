const Joi = require('joi')
const _ = require('lodash')
const mongoose = require('mongoose')
const OrderItem = require('../models/orderItem.model')
const MenuItem = require('../models/menuItem.model')
const { findMenu } = require('./menu.controller')

// present data to client side
const present = (obj) => {
  const { __v, ...data } = obj._doc
  return data
}

/*
precond:
- on every menuItemId from req.orderItemsData, exist menuItem in DB with such id 
*/
createOrderItems = async (req, res, next, order) => {
  try {
    const orderItemsData = await validateOrderItemsData(req, res, next)

    const orderItemIds = await orderItemsData.map(async (orderItemData) => {
      orderItem = new OrderItem({
        ..._.pick(orderItemData, ['menuItem', 'price', "name", "amount", "notes", "placedBy"]),
        order
      })
      await orderItem.save()
      return orderItem._id
    })

    return orderItemIds
  } catch (error) {
    next(error)
  }
}


validateOrderItemsData = async (req, res, next) => {
  const menu = await findMenu(req, res)

  // Incomplete, not including checkInteger(amount) , checkObjectId(menuItem)
  const basicSchema = {
    name: Joi.string().max(50).required(),
    price: Joi.number().required(),
    notes: Joi.string().max(255),
    amount: Joi.number().integer().positive().required(),
  }

  const validateMenuItemRef = async (objectId) => {
    const isValid = mongoose.Types.ObjectId.isValid
    if (!isValid(objectId)) {
      throw {
        resCode: 400,
        message: "This orderItemData.menuItem is not a valid objectId.",
        problematicData: orderItemData
      }
    }
    const menuItem = await MenuItem.findById(objectId)
    if (!menuItem || !menuItem.menu.equals(menu)) {
      throw {
        resCode: 400,
        message: "This orderItemData.menuItem does not refer to an existing menuItem in target restaurant.",
        problematicData: orderItemData
      }
    }
  }

  const validateBasic = (orderItemData) => {
    const data = _.pick(orderItemData, ['menuItem', 'price', "name", "amount", "notes", "placedBy"])
    const {error} = Joi.validate(data, basicSchema)
    if (error) {
      throw {
        resCode: 400,
        error: error.details[0].message,
        problematicData: orderItemData
      }
    }
  }
  
  try {
    const { orderItemsData } = req
    
    if (!Array.isArray(orderItemsData) || !orderItemsData.length) {
      throw {
        resCode: 400,
        message:
          'Request body shall contain orderItemsData. It is an array containing data for creating orderItems.',
      }
    }
    
    orderItemsData.forEach(orderItemData => {
      validateBasic(orderItemData)
      await validateMenuItemRef(orderItemData.menuItem)
    });

  } catch (error) {
    next(error)
  }
}



module.exports = {
  createOrderItems
}
