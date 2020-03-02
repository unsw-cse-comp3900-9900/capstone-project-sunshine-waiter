const mongoose = require('mongoose')
const keys = require('../keys')

const connectDb = () => {
  mongoose
    .connect(keys.url, {
      useNewUrlParser: true,
      user: keys.user,
      pass: keys.pwd,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(`Fail to connect to MongoDB: ${err}`))
}
module.exports = connectDb
