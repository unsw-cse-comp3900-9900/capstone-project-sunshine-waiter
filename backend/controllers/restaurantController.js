const Joi = require('joi')
const Restaurant = require('../models/restaurant')
const _ = require('lodash')

// create restaurant,
const createRestaurant = async (req, res, next) => {
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
    restaurant = new Restaurant(_.pick(req.body, ['name', 'description']))
    restaurant.createdBy = req.user._id
    await restaurant.save()

    // res
    res.status(201).json({
      data: _.pick(restaurant, ['_id', 'name', 'description']),
    })
  } catch (error) {
    next(error)
  }
}

readRestaurant = async (req, res, next) => {
  try {
    // find
    const restaurantId = req.params.restaurantId
    const restaurant = await Restaurant.findById(restaurantId)
    if (!restaurant)
      return res.status(404).json({ error: 'Restaurant does not exist' })

    // res
    res.json({
      data: _.pick(restaurant, ['_id', 'name', 'description']),
    })
  } catch (error) {
    next(error)
  }
}

readMyRestaurants = async (req, res, next) => {
  try {
    // find restaurant by user._id

    res.json({
      data: '[restaurants] place holder',
    })
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
    restaurant.email = description || restaurant.description
    await restaurant.save()

    // res
    return res.json({
      success: true,
      data: _.pick(restaurant, ['_id', 'name', 'email']),
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
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    description: Joi.string()
      .min(5)
      .max(2047),
  }

  return Joi.validate(restaurant, schema)
}

function validateUpdateDataFormat(restaurant) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50),
    description: Joi.string()
      .min(5)
      .max(2047),
  }

  return Joi.validate(restaurant, schema)
}

module.exports = {
  createRestaurant,
  readRestaurant,
  readMyRestaurants,
  updateRestaurant,
  deleteRestaurant,
}
