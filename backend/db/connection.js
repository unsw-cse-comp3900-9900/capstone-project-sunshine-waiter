const mongoose = require('mongoose')
const config = require('config')

const url = 'mongodb://mongo:27017/'
const userName = config.get('MONGO_INITDB_ROOT_USERNAME')
const pwd = config.get('MONGO_INITDB_ROOT_PASSWORD')

if (!url || !userName || !pwd) {
  console.error(
    'FATAL ERROR: environment variable for mongoDB is not properly defined! '
  )
  process.exit(1)
}

const connectDb = () => {
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      user: userName,
      pass: pwd,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(`Fail to connect to MongoDB: ${err}`))
}
module.exports = connectDb
