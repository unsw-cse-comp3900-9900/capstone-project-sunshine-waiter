const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
  cost: {
    type: Number,
    required: true,
  },
  title: {
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

  supportedConfiguration: [
    {
      name: { type: String, required: true },
      options: { type: String, required: true },
      maximumSelect: {
        type: Number,
        default: 0, // 0 means no restriction
        required: false, // non-exist means no restriction
        validate: {
          validator: Number.isInteger,
          message: '{VALUE} is not an integer value',
        },
      },
    },
  ],

  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    require: false,
  },
})

const MenuItem = mongoose.model('MenuItem', restaurantSchema)

module.exports = MenuItem
