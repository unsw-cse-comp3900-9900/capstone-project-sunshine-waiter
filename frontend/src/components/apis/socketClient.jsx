import io from 'socket.io-client'
import { message } from 'antd'

// userData is a json object that used to verify the user (authentication)
// configure is the event and its according responce

const connect = (component, URL, userData, configure) => {
  const socket = io.connect(URL)
  socket.emit('authenticate', userData)
  socket.on('authenticate success', namespace => {
    const safeConnect = io.connect(URL + namespace)
    message.success('Connection established!')
    for (let [event, response] of Object.entries(configure)) {
      safeConnect.on(event, response)
    }
    component.setState({
      socket: safeConnect,
    })
  })
  socket.on('connect_error', () => {
    message.error('Connect error')
  })
}

export { connect }
