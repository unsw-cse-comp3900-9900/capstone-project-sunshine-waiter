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

      res.status(400).json({
        error: `${JSON.stringify(
          keyValue
        )} is occupied. Please chose another value.`,
      })
    } else {
      console.log({ dev_msg: 'catch a new MongoError!', err })
      return res.status(500).json({ err })
    }
  } else return next(err)
}

const resCodeErrorHandler = (err, req, res, next) => {
  if (err && err.httpCode && err.message)
    res
      .status(err.httpCode)
      .json({ error: err.message, problematicData: err.problematicData })
  else {
    console.log(err)
    res.status(500).send(err.message)
  }
}

module.exports = { dbErrorHandler, resCodeErrorHandler }
