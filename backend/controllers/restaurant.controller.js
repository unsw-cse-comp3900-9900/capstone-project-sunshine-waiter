const Joi = require('joi')
const Restaurant = require('../models/restaurant.model')
const Menu = require('../models/menu.model')
const _ = require('lodash')

// present data to client side
const present = (obj) => {
  const { __v, createdBy, ...data } = obj._doc
  return data
}
// create restaurant,
createRestaurant = async (req, res, next) => {
  try {
    // validate
    const { error } = validateCreateDataFormat(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    // check unique
    let restaurant = await Restaurant.findOne({ name: req.body.name })
    if (restaurant)
      return res
        .status(400)
        .send('Restaurant with current name already registered.')

    // create
    restaurant = await dbCreateRestaurant({ ...req.body, userId: req.user._id })

    res.status(201).json({ data: present(restaurant) })
  } catch (error) {
    next(error)
  }
}

dbCreateRestaurant = async (data) => {
  const restaurant = new Restaurant({
    ..._.pick(data, ['name', 'description']),
    createdBy: data.userId,
    userGroups: {
      owner: [data.userId],
      manager: [data.userId],
      cook: [],
      waiter: [],
      cashier: [],
    },
  })
  const menu = new Menu({
    name: 'menu',
    menuItems: [],
    categories: [],
    restaurant,
  })
  await menu.save()
  restaurant.menu = menu._id
  await restaurant.save()
  return restaurant
}

readRestaurant = async (req, res, next) => {
  try {
    const restaurant = await findRestaurant(req)
    res.json({ data: present(restaurant) })
  } catch (error) {
    next(error)
  }
}

// designed for inside consumption. not for route handling.
const findRestaurant = async (req) => {
  const { restaurantId } = req.params
  if (!restaurantId)
    throw { httpCode: 400, message: 'URI params missing restaurantId ' }
  const restaurant = await findById(restaurantId)

  return restaurant
}

findById = async (id) => {
  const restaurant = await Restaurant.findById(id)
  if (!restaurant)
    return res.status(404).json({ error: `Restaurant ${id} does not exist.` })
  return restaurant
}

/*
precond: req.user exists;
*/
readMyRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ createdBy: req.user._id })
    const data = restaurants.map((obj) => present(obj))
    res.json({ data })
  } catch (error) {
    next(error)
  }
}

// update scope: { name, description }
updateRestaurant = async (req, res, next) => {
  try {
    // find
    const restaurantId = req.params.restaurantId
    const restaurant = await Restaurant.findById(restaurantId)
    if (!restaurant)
      return res.status(404).json({ error: 'Restaurant does not exist' })

    // validate new data
    const { name, description } = req.body
    const { error } = validateUpdateDataFormat({ name, description })
    if (error) return res.status(400).json({ error: error.details[0].message })

    // update
    restaurant.name = name || restaurant.name
    restaurant.description = description || restaurant.description
    await restaurant.save()

    // res
    return res.json({
      success: true,
      data: _.pick(restaurant, ['_id', 'name', 'description']),
      message: 'Restaurant updated.',
    })
  } catch (error) {
    next(error)
  }
}

deleteRestaurant = async (req, res, next) => {
  try {
    const restaurantId = req.params.restaurantId
    const restaurant = await Restaurant.findById(restaurantId)
    if (!restaurant)
      return res
        .status(204)
        .send('Restaurant has been deleted or does not exist at all.')

    await Restaurant.findByIdAndDelete(restaurantId)

    return res.json({
      success: true,
      data: _.pick(restaurant, ['_id', 'name', 'description']),
      message: 'Restaurant deleted.',
    })
  } catch (error) {
    next(error)
  }
}

function validateCreateDataFormat(restaurant) {
  const schema = {
    name: Joi.string().min(1).max(50).required(),
    description: Joi.string().min(1).max(2047),
  }

  return Joi.validate(restaurant, schema)
}

function validateUpdateDataFormat(restaurant) {
  const schema = {
    name: Joi.string().min(1).max(50),
    description: Joi.string().min(1).max(2047),
  }

  return Joi.validate(restaurant, schema)
}

module.exports = {
  createRestaurant,
  readRestaurant,
  readMyRestaurants,
  updateRestaurant,
  deleteRestaurant,

  findRestaurant,
  findById,
  dbCreateRestaurant,
}
