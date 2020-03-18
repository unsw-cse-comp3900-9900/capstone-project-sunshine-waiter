const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
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
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  description: {
    type: String,
    required: false,
    minlength: 5,
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
    require: false,
  },
})

const MenuItem = mongoose.model('MenuItem', restaurantSchema)

exports.MenuItem = MenuItem
