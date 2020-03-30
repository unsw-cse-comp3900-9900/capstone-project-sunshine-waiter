const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  configuration: [
    {
      name: { type: String, required: true },
      options: { type: String, required: true },
    },
  ],
  amount: {
    type: Number,
    default: 1,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value',
    },
  },

  notes: {
    type: String, // configuration, e.g lactose free
    required: true,
  },
  placedBy: {
    type: String, // ownership reference ID. e.g table number;
    required: true,
  },
  status: {
    // Shall be one of enum(PLASED, COOKING, READY, SERVING, SERVED, FAIL)
    type: String,
    required: true,
    default: 'PLASED',
  },
  readyTime: { type: Date },
  serveTime: { type: Date },
  servedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
})

const OrderItem = mongoose.model('OrderItem', restaurantSchema)

module.exports = OrderItem
