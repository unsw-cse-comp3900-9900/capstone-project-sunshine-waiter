const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1023, // **hashed** password
  },
  avatar: {
    type: String, // picture url
    required: false,
    minlength: 10,
    maxlength: 1023,
  },
  // restaurant serving
  servingRoles: {
    type: [
      {
        restaurant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Restaurant',
          required: true,
        },
        role: {
          type: String,
          // TODO: validate function
          // must be one of the allowed roles.
          required: true,
        },
      },
    ],
    required: true,
    default: [],
  },
  servingInvitations: {
    type: [
      {
        restaurant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Restaurant',
          required: true,
        },
        role: {
          type: String,
          // TODO: validate function
          // must be one of the allowed roles.
          required: true,
        },
      },
    ],
    required: true,
    default: [],
  },

  // website admin; not restaurant
  isAdmin: {
    type: Boolean,
    default: false,
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
