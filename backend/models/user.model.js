const mongoose = require('mongoose')
const { isValidRole } = require('../auth/authorization')

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
  currentJobs: {
    type: [
      {
        restaurant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Restaurant',
          required: true,
        },
        role: {
          type: String,
          required: true,
          validate: {
            validator: isValidRole,
            message: '{VALUE} is not an valid role.',
          },
        },
      },
    ],
    required: true,
    default: [],
  },
  pendingJobs: {
    type: [
      {
        restaurant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Restaurant',
          required: true,
        },
        role: {
          type: String,
          required: true,
          validate: {
            validator: isValidRole,
            message: '{VALUE} is not an valid role.',
          },
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
