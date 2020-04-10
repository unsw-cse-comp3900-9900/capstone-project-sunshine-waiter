const mongoose = require('mongodb')
const User = require('../models/user.model')
const Restaurant = require('../models/restaurant.model')

const { dbCreateUser } = require('../controllers/user.controller')
const { dbCreateRestaurant } = require('../controllers/restaurant.controller')
const { userData, restaurantData } = require('./devData.json')

const dbCreateCategories = async (dataArray) => {
  category = new Category({
    ..._.pick(req.body, ['name', 'description', 'isPrivate']),
    menu: menu._id,
  })
  await category.save()
}

// no idea how to add category progmatically without calling readCategory
exports.dbInit = async (req, res, next) => {
  console.log('dbInit called') // to delete
  try {
    // 1. reset users
    await User.remove({}) // delete all
    const createUserTasks = userData.map((data) =>
      (async () => {
        return await dbCreateUser(data)
      })()
    )
    const users = await Promise.all(createUserTasks)

    // 2. create restaurant
    await Restaurant.remove({}) // remove all restaurants
    const userId = users[0]._id // just create all restaurants in one user; it's just easier.
    const creatRstrTasks = restaurantData.map((data) =>
      (async () => {
        return await dbCreateRestaurant({ ...data, userId })
      })()
    )
    const restaurants = await Promise.all(creatRstrTasks)

    // 3. create categories
    // const categories = await dbCreateCategories(categoriesData)

    // // link categories with menu
    // const menuId = restaurants[0].menu
    // categories.forEach((c) => {
    //   c.menu = menuId
    // })

    // create menuItems  (10 items, top 5)

    // perpare order data for creating order

    //      menuItems =>
    // create orderItems
    //    for each orderItem,

    // manuly orderItem . servetime, cooktime,
    //

    // 4. create menuItems

    // 5. create order
    // 6. setup fake "servedBy", "cookedBy", "serveTime", "cookTime"

    res.send({ users, restaurants })
  } catch (error) {
    next(error)
  }
}
