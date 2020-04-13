const mongoose = require('mongodb')
const _ = require('lodash')

const User = require('../models/user.model')
const Restaurant = require('../models/restaurant.model')
const Category = require('../models/category.model')
const MenuItem = require('../models/menuItem.model')
const Order = require('../models/order.model')
const { OrderItem } = require('../models/orderItem.model')

const { dbCreateUser } = require('../controllers/user.controller')
const { dbCreateRestaurant } = require('../controllers/restaurant.controller')
const { restaurantData, categoryData, menuItemData } = require('./devData.json')

const { userData } = require('../dummyData/dummyUsers.json')
const { orderData } = require('../dummyData/dummyOrders.json')

function getRandom(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len)
  if (n > len)
    throw new RangeError('getRandom: more elements taken than available')
  while (n--) {
    var x = Math.floor(Math.random() * len)
    result[n] = arr[x in taken ? taken[x] : x]
    taken[x] = --len in taken ? taken[len] : len
  }
  return result
}

const dbCreateCategories = async (data, menuId) => {
  const category = new Category({
    ..._.pick(data, ['name', 'isArchived', 'isPrivate']),
    menu: menuId,
  })
  await category.save()
  return category
}

const dbCreateMenuItem = async (data, menuId, categoryIds) => {
  let randomInt = Math.floor(Math.random() * categoryIds.length)
  const menuItem = new MenuItem({
    ..._.pick(data, ['name', 'isArchived', 'isPrivate', 'price']),
    menu: menuId,
    categoryArray: [categoryIds[randomInt]],
  })
  await menuItem.save()
  return menuItem
}

const dbCreateOrder = async (data, restaurantId) => {
  const order = new Order({
    ..._.pick(data, ['isPaid', 'isAllServed', 'placedBy', 'createdAt']),
    restaurant: restaurantId,
  })
  await order.save()
  return order
}

const dbCreateOrderItem = async (order, menuItems, users) => {
  let amount = Math.ceil(Math.random() * 10) // an order may have upto 10 orderItems
  let orderItems = []
  for (let i = 0; i < amount; i++) {
    let randomItem = Math.floor(Math.random() * menuItems.length)
    let menuItem = menuItems[randomItem]
    let readyTime = new Date(
      order.createdAt.getTime() + Math.random() * 20 * 60 * 1000
    ) // order items may be ready after create up to 20 minuts
    let serveTime = new Date(
      readyTime.getTime() + Math.random() * 7 * 60 * 1000
    ) // order items may be served after ready up to 7 minuts
    let selected = getRandom(users, 2)
    let cookedBy = selected[0]._id
    let servedBy = selected[1]._id

    const orderItem = new OrderItem({
      menuItem: menuItem._id,
      ..._.pick(menuItem, ['name', 'price', 'categoryArray']),
      status: 'SERVED',
      order: order._id,
      restaurant: order.restaurant,
      placedBy: order.placedBy,
      readyTime: readyTime,
      serveTime: serveTime,
      cookedBy: cookedBy,
      servedBy: servedBy,
    })
    await orderItem.save()
    orderItems.push(orderItem)
  }
  return orderItems
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
        return await dbCreateCategories(data, menuId)
      })()
    )
    const categories = await Promise.all(createCategoryTasks)

    // 4. create menuItems  (10 items, top 5)
    await MenuItem.remove({})
    const categoryIds = categories.map((cat) => cat._id)
    const createMenuItemsTasks = menuItemData.map((data) =>
      (async () => {
        return await dbCreateMenuItem(data, menuId, categoryIds)
      })()
    )
    const menuItems = await Promise.all(createMenuItemsTasks)

    // 5. create order
    await Order.remove({})
    const restaurantId = restaurants[0]._id
    const createOrderTasks = orderData.map((data) =>
      (async () => {
        return await dbCreateOrder(data, restaurantId)
      })()
    )
    const orders = await Promise.all(createOrderTasks)

    // 6. create orderItems
    await OrderItem.remove({})
    const createOrderItemTasks = orders.map((order) =>
      (async () => {
        return await dbCreateOrderItem(order, menuItems, users)
      })()
    )
    const orderItems = await Promise.all(createOrderItemTasks)
    // console.log(orderItems)

    // 6. setup fake "servedBy", "cookedBy", "serveTime", "cookTime"

    res.send({ users, restaurants, categories, menuItems, orders, orderItems })
  } catch (error) {
    next(error)
  }
}
