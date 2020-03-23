const express = require('express')
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var port = process.env.PORT || 8000

var socket_namespaces = {}

app.use(express.json())

http.listen(port, function () {
  console.log('listening on *:' + port)
})
