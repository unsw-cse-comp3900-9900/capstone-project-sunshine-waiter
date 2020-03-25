import React from 'react'
import Dishes from './Dishes'
import Request from './Request'
import './Waiter.css'
import io from 'socket.io-client'
import { dishes, requests } from './fakeData'

const URL = 'http://localhost:8000'

const arrayToObj = array => {
  var result = {}
  for (var item of array) {
    result[item._id] = item
  }
  return result
}

class Waiter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      socket: null,
      dishQue: dishes,
      requestQue: requests,
    }
    this.handleDishChange = this.handleDishChange.bind(this)
    this.handleRequestChange = this.handleRequestChange.bind(this)
  }

  // handle incoming new dish
  newDish = dish => {
    const newDishQue = [...this.state.dishQue, dish]
    this.setState({
      dishQue: newDishQue,
    })
  }

  // handle incoming new request
  newRequest = request => {
    const newRequests = [...this.props.requests, request]
    this.setState({
      requestQue: newRequests,
    })
  }

  handleDishChange(newDishQue) {
    this.setState({
      dishQue: newDishQue,
    })
  }

  handleRequestChange(newRequests) {
    this.setState({
      requestQue: newRequests,
    })
  }

  async componentDidMount() {
    // Start connection
    const socket = io.connect(URL)
    socket.emit('authenticate', {
      restaurantId: 'restaurant1',
      userId: 'user1',
      userType: 'waiter',
      password: 'password',
    })
    socket.on('authenticate success', namespace => {
      const safeConnect = io.connect(URL + namespace)
      alert('connect established')
      safeConnect.on('new dish', this.newDish)
      safeConnect.on('new request', this.newRequest)
      this.setState({
        socket: safeConnect,
      })
    })
  }

  render() {
    return (
      <div>
        <header>
          <h1 id="welcome-message">Welcome to the Waiter Page.</h1>
        </header>
        <div id="box-container">
          <Dishes
            handleDishChange={this.handleDishChange}
            dishQue={arrayToObj(this.state.dishQue)}
            socket={this.state.socket}
          />
          <Request
            handleRequestChange={this.handleRequestChange}
            requestQue={arrayToObj(this.state.requestQue)}
            socket={this.state.socket}
          />
        </div>
      </div>
    )
  }
}

export default Waiter
