const mongoose = require('mongoose')

// require restaurant admin to update orderItems
const restaurantSchema = new mongoose.Schema({
  orderItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }],

  isPaid: {
    type: Boolean,
    required: true,
  },

  isAllServed: {
    type: Boolean,
    required: true,
  },

  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },

  placedBy: {
    type: String, // ownership reference ID. e.g table number;
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
  },
})

const Order = mongoose.model('Order', restaurantSchema)

module.exports = Order
