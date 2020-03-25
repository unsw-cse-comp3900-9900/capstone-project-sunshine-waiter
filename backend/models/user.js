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
  // website admin; not restaurant
  isAdmin: {
    type: Boolean,
    default: false,
  },
})

const User = mongoose.model('User', userSchema)

exports.User = User
