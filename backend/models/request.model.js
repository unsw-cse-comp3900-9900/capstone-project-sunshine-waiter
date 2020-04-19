const mongoose = require('mongoose')

// require restaurant admin to update orderItems
const requestSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },

  tableId: {
    type: Number, // ownership reference ID. e.g table number;
    required: true,
  },

  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    require: true,
  },

  receiveTime: {
    type: Date,
    required: true,
  },

  finishTime: {
    type: Date,
    required: false,
  },

  handleBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: false,
  },
})

const Request = mongoose.model('Request', requestSchema)

module.exports = Request
