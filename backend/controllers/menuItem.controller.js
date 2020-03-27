const Joi = require('joi')
const _ = require('lodash')

const MenuItem = require('../models/menuItem.model')
const Menu = require('../models/menu.model')
const { findMenu } = require('./menu.controller')

// present data to client side
const present = obj => {
  const { __v, ...data } = obj._doc
  return data
}

// create menuItem { title, cost, description, note  }
createMenuItem = async (req, res, next) => {
  try {
    // validate input ( params, body )
    const { error } = validateCreateDataFormat(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })
    const menu = await findMenu(req, res)

    // create menuItem
    menuItem = new MenuItem({
      ..._.pick(req.body, ['title', 'cost', 'description', 'note']),
      menu: menu._id,
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

    res.json({ data: menuItems.map(v => present(v)) })
  } catch (error) {
    next(error)
  }
}

// update scope: { title, description }
updateMenuItem = async (req, res, next) => {
  try {
    // find
    const menuItemId = req.params.menuItemId
    const menuItem = await MenuItem.findById(menuItemId)
    if (!menuItem)
      return res.status(404).json({ error: 'MenuItem does not exist' })

    // validate new data
    const { title, description } = req.body
    const { error } = validateUpdateDataFormat({ title, description })
    if (error) return res.status(400).json({ error: error.details[0].message })

    // update
    menuItem.title = title || menuItem.title
    menuItem.description = description || menuItem.description
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
      data: _.pick(menuItem, ['_id', 'title', 'description']),
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
    title: Joi.string()
      .max(50)
      .required(),
    cost: Joi.number().required(),
    description: Joi.string().max(2047),
    note: Joi.string().max(255),
  }

  return Joi.validate(menuItem, schema)
}

function validateUpdateDataFormat(menuItem) {
  const schema = {
    title: Joi.string()
      .min(5)
      .max(50),
    description: Joi.string()
      .min(5)
      .max(2047),
  }

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
