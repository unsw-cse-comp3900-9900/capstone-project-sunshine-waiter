const mongoose = require('mongoose')

const dbErrorHandler = (err, req, res, next) => {
  if (!err) return next()

  if (err instanceof mongoose.CastError) {
    const { value: id, model } = err

    res.status(400).json({
      err: `${id} is invalid! collection name: ${model.collection.collectionName}`,
    })
  }
  if (err.name === 'MongoError') {
    if (err.code == 11000) {
      const { keyValue } = err
      console.log({ err })

      res.status(400).json({
        error: `${JSON.stringify(
          keyValue
        )} is occupied. Please chose another value.`,
      })
    } else res.status(500).json({ err })
  } else return next(err)
}

module.exports = dbErrorHandler
