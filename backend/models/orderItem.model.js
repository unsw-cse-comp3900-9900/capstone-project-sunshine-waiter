const mongoose = require('mongoose')

const allowedStatus = Object.freeze({
  PLACED: 'PLACED',
  COOKING: 'COOKING',
  READY: 'READY',
  SERVING: 'SERVING',
  SERVED: 'SERVED',
  FAIL: 'FAIL',
})
/*
Design base
1. The menuItem can be updated/deleted later on. We have to store some basic information here.
2. Considering discount, the real price can be different from order.menuItem.price.
*/

const restaurantSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  categoryArray: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],

  name: {
    // init with menuItem.name; shall not be updated.
    // keep this record because menuItem can be modified/deleted in future.
    type: String,
    required: true,
    maxlength: 50,
  },
  amount: {
    // can only be updated by restaurant staff ( base on the agreement from costomer and restaurant )
    type: Number,
    default: 1,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value',
    },
  },
  notes: {
    // can only be updated by restaurant staff when the status is PLACED ( base on the agreement from costomer and restaurant )
    type: String, // configuration, e.g lactose free
    required: false,
  },
  placedBy: {
    type: String, // ownership reference ID. e.g table number;
    required: true,
  },
  status: {
    // Shall be one of enum(PLACED, COOKING, READY, SERVING, SERVED, FAIL)
    type: String,
    required: true,
    default: 'PLACED',
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

module.exports = { OrderItem, allowedStatus }
