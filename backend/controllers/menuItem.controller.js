const Joi = require('joi')
const _ = require('lodash')
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

const MenuItem = require('../models/menuItem.model')
const Category = require('../models/category.model')
const { findMenu } = require('./menu.controller')
const {
  presentMenuItem: present,
  presentMenuItemImg: presentImg,
} = require('../util')

// create menuItem { name, price, description, note  }
createMenuItem = async (req, res, next) => {
  try {
    // validate input ( params, body )
    const { error } = validateCreateDataFormat(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })
    const menuId = (await findMenu(req, res))._id
    // validate categoryArray
    await req.body.categoryArray.forEach(async (categoryId) => {
      try {
        const category = await Category.findById(categoryId)
        if (!category || !category.menu.equals(menuId) || category.isArchived)
          throw { httpCode: 404, message: 'Category not found.' }
      } catch (error) {
        next(error)
      }
    })

    const menu = await findMenu(req, res)

    // create menuItem
    menuItem = new MenuItem({
      ..._.pick(req.body, [
        'name',
        'price',
        'description',
        'note',
        'categoryArray',
        'isPrivate',
      ]),
      menu: menu._id,
    })

    menuItem.categoryArray = menuItem.categoryArray || []
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

readMenuItemPublicly = async (req, res, next) => {
  try {
    // find menuItem
    const menuItemId = req.params.menuItemId
    const menuItem = await MenuItem.findById(menuItemId)
    if (!menuItem || menuItem.isArchived || menuItem.isPrivate)
      return res.status(404).json({ error: `MenuItem ${menuItemId} not found` })

    // res
    res.status(201).json({ data: present(menuItem) })
  } catch (error) {
    next(error)
  }
}

readManyPublicly = async (req, res, next) => {
  try {
    const menu = await findMenu(req, res)
    const menuItems = await MenuItem.find({
      menu: menu._id,
      isArchived: false,
      isPrivate: false,
    })
    res.json({ data: menuItems.map((v) => present(v)) })
  } catch (error) {
    next(error)
  }
}

// update scope: { name, description }
updateMenuItem = async (req, res, next) => {
  try {
    // find menuItem
    const menuItemId = req.params.menuItemId
    const menuItem = await MenuItem.findById(menuItemId)
    if (!menuItem) return res.status(404).send('menuItem not found.')
    if (menuItem.isArchived)
      return res.status(403).send('archived document is immutable')

    // validate new data
    const { error } = validateUpdateDataFormat(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })
    const {
      name,
      description,
      categoryArray,
      note,
      price,
      isPrivate,
    } = req.body

    // update
    await menuItem.snapshot()
    menuItem.name = name || menuItem.name
    menuItem.price = price || menuItem.price
    menuItem.description = description || menuItem.description
    menuItem.categoryArray = categoryArray || menuItem.categoryArray
    menuItem.note = note || menuItem.note

    menuItem.isPrivate =
      typeof isPrivate === 'boolean' ? isPrivate : menuItem.isPrivate

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

// Instead of removing target object from DB, it will permanently archive it.
deleteMenuItem = async (req, res, next) => {
  try {
    const menuItemId = req.params.menuItemId
    const menuItem = await MenuItem.findById(menuItemId)
    if (!menuItem) return res.status(404).send('menuItem not found.')
    if (menuItem.isArchived) return res.status(204).send()

    // archive it
    menuItem.isArchived = true
    await menuItem.save()

    return res.json({
      success: true,
      data: present(menuItem),
      message: 'MenuItem permanently archived.',
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

// image endpoints: upload, read, delete
uploadImage = async (req, res, next) => {
  try {
    // 0 - validate input
    const file = req.file
    if (!file) throw { httpCode: 400, message: `Image file is required.` }
    const id = req.params.menuItemId
    const obj = await MenuItem.findById(id)
    if (!obj)
      throw { httpCode: 404, message: `Target object not found. Id: ${id}` }

    // 1 - save newImg  remove oldImage from disk if any;
    const { path } = obj.img
    const newImg = {
      contentType: file.mimetype,
      originalname: file.originalname,
      path: file.path,
    }
    obj.img = newImg
    await obj.save()
    if (path) await diskDeleteFileByPath(path)

    // 2 - reply with presentable image
    res.json({
      data: presentImg(obj),
      message: 'Successfully upload iamge. May have replaced old image if any.',
    })
  } catch (error) {
    next(error)
  }
}

readImage = async (req, res, next) => {
  try {
    const { menuItemId: id } = req.params
    const obj = await MenuItem.findById(id)
    if (!obj)
      throw { httpCode: 404, message: `Target obj not found. Id: ${id}` }

    const { path } = obj.img
    if (!path)
      throw {
        httpCode: 404,
        message: `For obj ${id}, img not found.`,
      }

    res.sendFile(path, (Headers = { contentType: obj.img.contentType }))
  } catch (error) {
    next(error)
  }
}

deleteImage = async (req, res, next) => {
  try {
    // 0 validate input
    const { menuItemId: id } = req.params
    const obj = await MenuItem.findById(id)
    if (!obj)
      throw { httpCode: 404, message: `Target obj not found. Id: ${id}` }

    // 1 - delete current img
    const { path } = obj.img
    if (!path)
      throw {
        httpCode: 404,
        message: `For obj ${id}, img not found.`,
      }

    obj.img = undefined
    await obj.save()
    console.log(path)
    await diskDeleteFileByPath(path)

    // 2 - reply with presentable image
    res.json({ message: 'Successfully delete iamge.' })
  } catch (error) {
    next(error)
  }
}

// Util functions

diskDeleteFileByPath = async (path) => {
  const err = await unlinkAsync(path)
  if (err)
    throw {
      httpCode: 400,
      message: `fs failed to delete file. It may have been deleted before.`,
      error: err,
    }
}

// validation functions
function validateCreateDataFormat(menuItem) {
  const schema = {
    name: Joi.string().max(50).required(),
    price: Joi.number().required(),
    description: Joi.string().max(2047),
    note: Joi.string().max(255),
    categoryArray: Joi.array(),
    isPrivate: Joi.boolean(),
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
    isPrivate: Joi.boolean(),
  }
  return Joi.validate(menuItem, schema)
}

module.exports = {
  createMenuItem,
  readMenuItem,
  readMenuItemPublicly,
  updateMenuItem,
  deleteMenuItem,
  readMany,
  readManyPublicly,

  uploadImage,
  readImage,
  deleteImage,
}
