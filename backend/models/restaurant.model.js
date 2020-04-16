const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true,
  },
  description: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 2047,
  },
  pic: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 200,
  },

  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    require: false,
  },

  userGroups: {
    owner: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    manager: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    cook: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    waiter: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    cashier: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

const Restaurant = mongoose.model('Restaurant', restaurantSchema)

module.exports = Restaurant
