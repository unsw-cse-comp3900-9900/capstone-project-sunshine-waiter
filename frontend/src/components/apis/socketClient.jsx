import io from 'socket.io-client'
import { message } from 'antd'

// userData is a json object that used to verify the user (authentication)
// configure is the event and its according responce

const connect = (component, URL, userData, config) => {
  const socket = io(URL, { autoConnect: false })
  socket.io.opts.query = userData
  socket.connect()
  socket.on('authenticate success', namespace => {
    const safeConnect = io(URL + namespace, { autoConnect: false })
    safeConnect.io.opts.query = userData
    safeConnect.connect()
    for (let [event, response] of Object.entries(config)) {
      safeConnect.on(event, response)
    }
    component.setState({
      socket: safeConnect,
    })
    socket.close()
  })
  socket.on('connect_timeout', () => {
    message.error('Connect timeout')
  })
}

export { connect }
