import React from 'react'
import Dishes from './Dishes'
import Request from './Request'
import './Waiter.css'
import { connect } from '../apis/socketClient'
import { fakeData } from './fakeData'

const { dishes, requests } = fakeData

const URL = 'http://localhost:8000'

const arrayToObj = array => {
  let result = {}
  for (let item of array) {
    result[item._id] = item
  }
  return result
}

const objToArray = obj => {
  let result = []
  for (let key in obj) {
    result.push(obj[key])
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
  }

  update = queName => {
    return target => {
      const newObj = arrayToObj(this.state[queName])
      newObj[target._id] = target
      switch (queName) {
        case 'dishQue':
          const newDishQue = objToArray(newObj).filter(
            dish => dish.state == 'READY' || dish.state == 'SERVING'
          )
          this.setState({
            dishQue: newDishQue,
          })
          break
        case 'requestQue':
          const newRequestQue = objToArray(newObj).filter(
            request => request.finishTime == null
          )
          this.setState({
            requestQue: newRequestQue,
          })
      }
    }
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
      'update dish': this.update('dishQue'),
      'update request': this.update('requestQue'),
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
            dishQue={arrayToObj(this.state.dishQue)}
            socket={this.state.socket}
          />
          <Request
            requestQue={arrayToObj(this.state.requestQue)}
            socket={this.state.socket}
          />
        </div>
      </div>
    )
  }
}

export default Waiter
