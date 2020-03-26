const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  description: {
    type: String,
    required: false,
    maxlength: 2047,
  },
  pic: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 200,
  },

  menuItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
  categories: [{ type: String }],

  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
})

const Menu = mongoose.model('Menu', restaurantSchema)

module.exports = Menu
