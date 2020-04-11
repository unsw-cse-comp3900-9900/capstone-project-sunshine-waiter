const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  isArchived: {
    type: Boolean,
    required: true,
    default: false,
  },
  isPrivate: {
    type: Boolean,
    required: true,
    default: true,
  },
  price: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: 100,
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
  history: { type: Array, require: true, default: [] },
})

schema.methods.snapshot = async function () {
  const { history, ...current } = this._doc
  const snapshot = { ...current, updatedAt: Date() }
  this.history.push(snapshot)

  await this.save()
}

const MenuItem = mongoose.model('MenuItem', schema)

module.exports = MenuItem
