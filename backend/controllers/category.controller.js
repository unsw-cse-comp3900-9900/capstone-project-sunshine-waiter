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
    // find category
    const categoryId = req.params.categoryId
    const category = await Category.findById(categoryId)
    if (!category) return res.status(404).send('Category not found.')
    if (category.isArchived)
      return res.status(403).send('archived document is immutable')

    // validate new data
    const { name, description } = req.body
    const { error } = validateUpdateDataFormat({ name, description })
    if (error) return res.status(400).json({ error: error.details[0].message })

    // snapshot -> update
    await category.snapshot()
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

// Instead of removing target object from DB, it will permanently archive it.
deleteCategory = async (req, res, next) => {
  try {
    // 1. find category
    const categoryId = req.params.categoryId
    const category = await Category.findById(categoryId)
    if (!category) return res.status(404).send('Category not found.')
    if (category.isArchived) return res.status(204).send()

    // 2. update menuItem reference
    const menu = await findMenu(req, res)
    const allMenuItemsInRestaurant = await MenuItem.find({ menu: menu.id })
    allMenuItemsInRestaurant.forEach(async (menuItem) => {
      if (menuItem.isArchived) return

      const { categoryArray: cArray } = menuItem
      if (Array.isArray(cArray) && cArray.includes(categoryId)) {
        await menuItem.snapshot()
        menuItem.categoryArray = cArray.filter((id) => !id.equals(categoryId))
        await menuItem.save()
      }
    })

    // 3. archive it
    category.isArchived = true
    await category.save()

    return res.json({
      success: true,
      data: present(category),
      message: 'Category permanently archived.',
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
    name: Joi.string().min(1).max(50),
    description: Joi.string().min(1).max(2047),
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
