const Joi = require('joi')
const _ = require('lodash')

const MenuItem = require('../models/menuItem.model')
const { findMenu } = require('./menu.controller')

// present data to client side
const present = (obj) => {
  const { __v, ...data } = obj._doc
  return data
}

// create menuItem { name, price, description, note  }
createMenuItem = async (req, res, next) => {
  try {
    // validate input ( params, body )
    const { error } = validateCreateDataFormat(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })
    const menu = await findMenu(req, res)

    // create menuItem
    menuItem = new MenuItem({
      ..._.pick(req.body, ['name', 'price', 'description', 'note']),
      menu: menu._id,
      categoryArray: [],
    })
    await menuItem.save()

    res.status(201).json({ data: present(menuItem) })
  } catch (error) {
    next(error)
  }
}

readMenuItem = async (req, res, next) => {
  try {
    // find
    const menuItemId = req.params.menuItemId
    const menuItem = await MenuItem.findById(menuItemId)
    if (!menuItem)
      return res.status(404).json({ error: 'MenuItem does not exist' })

    // res
    res.status(201).json({ data: present(menuItem) })
  } catch (error) {
    next(error)
  }
}

readMany = async (req, res, next) => {
  try {
    const menu = await findMenu(req, res)
    const menuItems = await MenuItem.find({ menu: menu._id })

    res.json({ data: menuItems.map((v) => present(v)) })
  } catch (error) {
    next(error)
  }
}

// update scope: { name, description }
updateMenuItem = async (req, res, next) => {
  try {
    // find
    const menuItemId = req.params.menuItemId
    const menuItem = await MenuItem.findById(menuItemId)
    if (!menuItem)
      return res.status(404).json({ error: 'MenuItem does not exist' })

    // validate new data
    const { error } = validateUpdateDataFormat(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })
    const { name, description, categoryArray, note, price } = req.body

    // update
    menuItem.name = name || menuItem.name
    menuItem.price = price || menuItem.price
    menuItem.description = description || menuItem.description
    menuItem.categoryArray = categoryArray || menuItem.categoryArray
    menuItem.note = note || menuItem.note

    await menuItem.save()

    // res
    return res.json({
      success: true,
      data: present(menuItem),
      message: 'MenuItem updated.',
    })
  } catch (error) {
    next(error)
  }
}

deleteMenuItem = async (req, res, next) => {
  try {
    const menuItemId = req.params.menuItemId
    const menuItem = await MenuItem.findById(menuItemId)
    if (!menuItem)
      return res
        .status(204)
        .send('MenuItem has been deleted or does not exist at all.')

    await MenuItem.findByIdAndDelete(menuItemId)

    return res.json({
      success: true,
      data: present(menuItem),
      message: 'MenuItem deleted.',
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

function validateCreateDataFormat(menuItem) {
  const schema = {
    name: Joi.string().max(50).required(),
    price: Joi.number().required(),
    description: Joi.string().max(2047),
    note: Joi.string().max(255),
    categoryArray: Joi.array(),
  }

  return Joi.validate(menuItem, schema)
}

/* example
    "categoryArray": [],
    "name": "beff rice nuddle - big",
    "price": 30,
    "description": "200 years of improvement. ",
    "note": "Available after 10:30am at participating restaurants"
*/
function validateUpdateDataFormat(menuItem) {
  const schema = {
    name: Joi.string().min(1).max(50),
    description: Joi.string().min(1).max(2047),
    note: Joi.string().min(1).max(2047),
    price: Joi.number().min(0),
    categoryArray: Joi.array(),
  }

  // TODO: menuItem.categoryArray.foreach: validate(categoryId)

  return Joi.validate(menuItem, schema)
}

module.exports = {
  createMenuItem,
  readMenuItem,
  updateMenuItem,
  deleteMenuItem,
  readMany,
  deleteMany,
}
