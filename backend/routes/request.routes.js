const express = require('express')
const router = express.Router()

const { createRequest } = require('../controllers/request.controller')

// public access ( customer dosen't need to login/register )
router.post('/:restaurantId/request/', createRequest)

module.exports = router
