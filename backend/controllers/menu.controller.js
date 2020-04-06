const Joi = require('joi')
const Restaurant = require('../models/restaurant.model')
const Menu = require('../models/menu.model')
const Category = require('../models/category.model')
const MenuItem = require('../models/menuItem.model')
const _ = require('lodash')

const present = (obj) => {
  const { __v, ...data } = obj._doc
  return data
}

/*
1. no menuId, only Restaurant Id
*/
readMenu = async (req, res, next) => {
  try {
    const obj = await findMenu(req, res)
    const menuItems = (await MenuItem.find({ menu: obj._id })) || []
    const categories = (await Category.find({ menu: obj._id })) || []

    res.json({ data: { menuItems, categories, ...present(obj) } })
  } catch (error) {
    next(error)
  }
}

// update scope: { name, description }
updateMenu = async (req, res, next) => {
  try {
    const obj = await findMenu(req, res)

    // validate new data
    const { name, description } = req.body
    const { error } = validateUpdateDataFormat({ name, description })
    if (error) return res.status(400).json({ error: error.details[0].message })

    // update
    obj.name = name || obj.name
    obj.description = description || obj.description
    await obj.save()

    // res
    return res.json({
      success: true,
      data: obj,
      message: 'Menu updated.',
    })
  } catch (error) {
    next(error)
  }
}

/*
returns a menu instance base on req.param.restaurant.
Note that it's not a req handler. 

precond: 
1. req.params.restaurantId exist;
2. any restaurant has menu; 
*/
const findMenu = async (req, res) => {
  // find menu
  const restaurantId = req.params.restaurantId
  const restaurant = await Restaurant.findById(restaurantId)
  if (!restaurant)
    return res.status(404).json({ error: 'Restaurant does not exist' })

  const menu = await Menu.findById(restaurant.menu)
  if (!menu)
    return res
      .status(500)
      .json({ error: 'Server error! Restaurant does not have menu!' })

  return menu
}

function validateUpdateDataFormat(menu) {
  const schema = {
    name: Joi.string().min(1).max(50),
    description: Joi.string().min(1).max(2047),
  }

  return Joi.validate(menu, schema)
}

module.exports = {
  readMenu,
  updateMenu,

  findMenu, // Note that it's not a req handler.
}
