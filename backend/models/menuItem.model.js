const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  description: {
    type: String,
    required: false,
    maxlength: 1023,
  },
  note: {
    type: String,
    required: false,
    maxlength: 1023,
  },
  pic: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 200,
  },
  thumbnail: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 200,
  },
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    require: true,
  },
  categoryArray: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
})

const MenuItem = mongoose.model('MenuItem', restaurantSchema)

module.exports = MenuItem
