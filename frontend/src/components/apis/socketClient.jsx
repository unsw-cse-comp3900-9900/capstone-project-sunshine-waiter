import io from 'socket.io-client'

// userData is a json object that used to verify the user (authentication)
// configure is the event and its according responce

const connect = (component, URL, userData, configure) => {
  const socket = io.connect(URL)
  socket.emit('authenticate', userData)
  socket.on('authenticate success', namespace => {
    const safeConnect = io.connect(URL + namespace)
    alert('connect established')
    for (let [event, response] of Object.entries(configure)) {
      safeConnect.on(event, response)
    }
    component.setState({
      socket: safeConnect,
    })
  })
}

export { connect }
