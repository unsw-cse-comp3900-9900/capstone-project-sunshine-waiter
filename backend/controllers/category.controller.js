const Joi = require('joi')
const _ = require('lodash')

const Category = require('../models/category.model')
const MenuItem = require('../models/menuItem.model')
const { findMenu } = require('./menu.controller')

// present data to client side
const present = (obj) => {
  const { __v, ...data } = obj._doc
  return data
}

// create category { name, description }
createCategory = async (req, res, next) => {
  try {
    // validate input ( params, body )
    const { error } = validateCreateDataFormat(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    const menu = await findMenu(req, res)

    // create category
    category = new Category({
      ..._.pick(req.body, ['name', 'description']),
      menu: menu._id,
    })
    await category.save()

    res.status(201).json({ data: present(category) })
  } catch (error) {
    next(error)
  }
}

readCategory = async (req, res, next) => {
  try {
    // find
    const categoryId = req.params.categoryId
    const category = await Category.findById(categoryId)
    if (!category)
      return res.status(404).json({ error: 'Category does not exist' })

    // res
    res.status(201).json({ data: present(category) })
  } catch (error) {
    next(error)
  }
}

readMany = async (req, res, next) => {
  try {
    const menu = await findMenu(req, res)
    const categories = await Category.find({ menu: menu._id })

    res.json({ data: categories.map((v) => present(v)) })
  } catch (error) {
    next(error)
  }
}

// update scope: { name, description }
updateCategory = async (req, res, next) => {
  try {
    // find
    const categoryId = req.params.categoryId
    const category = await Category.findById(categoryId)
    if (!category)
      return res.status(404).json({ error: 'Category does not exist' })

    // validate new data
    const { name, description } = req.body
    const { error } = validateUpdateDataFormat({ name, description })
    if (error) return res.status(400).json({ error: error.details[0].message })

    // update
    category.name = name || category.name
    category.description = description || category.description
    await category.save()

    // res
    return res.json({
      success: true,
      data: present(category),
      message: 'Category updated.',
    })
  } catch (error) {
    next(error)
  }
}

deleteCategory = async (req, res, next) => {
  try {
    const menu = await findMenu(req, res)
    
    const categoryId = req.params.categoryId
    const category = await Category.findById(categoryId)
    if (!category)
      return res
        .status(204)
        .send('Category has been deleted or does not exist at all.')

    // update menuItem reference
    const allMenuItemsInRestaurant = await MenuItem.find({ menu: menu.id })
    allMenuItemsInRestaurant.forEach((menuItem) => {
      if (menuItem.categorys.includes(categoryId)) {
        menuItem.categorys = menuItem.categorys.filter((id) => !id.equals(categoryId))
        await menuItem.save()
      }
    })
    console.log(allMenuItemsInRestaurant)

    await Category.findByIdAndDelete(categoryId)

    return res.json({
      success: true,
      data: present(category),
      message: 'Category deleted.',
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

function validateCreateDataFormat(category) {
  const schema = {
    name: Joi.string().max(50).required(),
    description: Joi.string().max(2047),
  }

  return Joi.validate(category, schema)
}

function validateUpdateDataFormat(category) {
  const schema = {
    name: Joi.string().min(5).max(50),
    description: Joi.string().min(5).max(2047),
  }

  return Joi.validate(category, schema)
}

module.exports = {
  createCategory,
  readCategory,
  updateCategory,
  deleteCategory,
  readMany,
  deleteMany, // not yet implemented
}
