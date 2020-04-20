const multer = require('multer')
const pathOfImages = '/./../upload/images'
const upload = multer({ dest: __dirname + pathOfImages })

function singleImageUploadHandler(key = 'image') {
  return upload.single(key)
}

module.exports = { singleImageUploadHandler }
