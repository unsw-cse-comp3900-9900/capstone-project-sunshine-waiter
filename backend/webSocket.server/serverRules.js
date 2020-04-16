const { updateItem } = require('../controllers/orderItem.controller')
const { dishes, requests } = require('./fakeData')

const serverRules = (nsp, userId, restaurant, type) => {
  return (socket) => {
    console.log(type + ' ' + userId + ' connect to ' + restaurant._id)
    socket.join(type) // put user into rooms according to their type
    socket.on('update dish', async (item) => {
      // dish served or fail send from waiter, server need to update the db
      // update db
      // console.log(item)
      await updateItem(restaurant._id, item)
      dishes[item._id] = item
      nsp.to('waiter').emit('update dish', item) // let all other waiter know
      nsp.to('cook').emit('update dish', item)
    })

    socket.on('update request', (request) => {
      // update db
      requests[request._id] = request
      nsp.to('waiter').emit('update request', request)
    })
    socket.on('disconnect', () => {
      console.log(type + ' ' + userId + ' disconnect to ' + restaurant._id)
    })

    // initiate with dummy data
    switch (type) {
      case 'cook':
        socket.emit('initiate data', dishes)
        break
      case 'waiter':
        socket.emit('initiate data', dishes, requests)
        break
      default:
    }
  }
}

module.exports = serverRules
