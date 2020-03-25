import React from 'react'
import Dishes from './Dishes'
import Request from './Request'
import './Waiter.css'
import { connect } from '../apis/socketClient'
import { dishes, requests } from './fakeData'

const URL = 'http://localhost:8000'

const arrayToObj = array => {
  let result = {}
  for (let item of array) {
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

  componentDidMount() {
    const userData = {
      restaurantId: 'restaurant1',
      userId: 'user1',
      userType: 'waiter',
      password: 'password',
    }

    // configure includs the event and response you defined for the socket
    const configure = {
      'new dish': this.newDish,
      'new request': this.newRequest,
    }

    connect(this, URL, userData, configure)
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
