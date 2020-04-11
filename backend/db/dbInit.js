const mongoose = require('mongodb')
const _ = require('lodash')

const User = require('../models/user.model')
const Restaurant = require('../models/restaurant.model')
const Category = require('../models/category.model')
const MenuItem = require('../models/menuItem.model')

const { dbCreateUser } = require('../controllers/user.controller')
const { dbCreateRestaurant } = require('../controllers/restaurant.controller')
const {
  userData,
  restaurantData,
  categoryData,
  menuItemData,
} = require('./devData.json')

const dbCreateCategories = async (data) => {
  const category = new Category({
    ..._.pick(data, ['name', 'isArchived', 'isPrivate']),
    menu: data.menuId,
  })
  await category.save()
  return category
}

const dbCreateMenuItem = async (data) => {
  let randomInt = Math.floor(Math.random() * data.catogoryIds.length)
  const menuItem = new MenuItem({
    ..._.pick(data, ['name', 'isArchived', 'isPrivate', 'price']),
    menu: data.menuId,
    categoryArray: [data.catogoryIds[randomInt]],
  })
  await menuItem.save()
  return menuItem
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
    await Category.remove({})
    const menuId = restaurants[0].menu._id
    const createCategoryTasks = categoryData.map((data) =>
      (async () => {
        return await dbCreateCategories({ ...data, menuId })
      })()
    )
    const categories = await Promise.all(createCategoryTasks)

    // 4. create menuItems  (10 items, top 5)
    await MenuItem.remove({})
    const catogoryIds = categories.map((cat) => cat._id)
    const createMenuItemsTasks = menuItemData.map((data) =>
      (async () => {
        return await dbCreateMenuItem({ ...data, menuId, catogoryIds })
      })()
    )
    const menuItems = await Promise.all(createMenuItemsTasks)

    // 5. create order
    // 6. setup fake "servedBy", "cookedBy", "serveTime", "cookTime"

    res.send({ users, restaurants, categories, menuItems })
  } catch (error) {
    next(error)
  }
}
