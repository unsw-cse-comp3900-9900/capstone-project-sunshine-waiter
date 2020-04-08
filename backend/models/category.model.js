const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  isArchived: {
    type: Boolean,
    required: true,
    default: false,
  },
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  description: {
    type: String,
    required: false,
    maxlength: 2047,
  },
  pic: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 200,
  },
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: true,
  },
  history: { type: Array, require: true, default: [] },
})

schema.methods.snapshot = async function () {
  const { history, ...current } = this._doc
  const snapshot = { ...current, updatedAt: Date() }
  this.history.push(snapshot)

  await this.save()
}

const Category = mongoose.model('Category', schema)

module.exports = Category
