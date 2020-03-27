import React from 'react'
import Dishes from './Dishes'
import Request from './Request'
import './Waiter.css'
import { notification } from 'antd'
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
    this.user = {
      restaurantId: 'restaurant1',
      userId: 'user1',
      userType: 'waiter',
      userName: 'Steve',
      password: 'password',
    }
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
          const newDishQue = objToArray(newObj)
            .filter(dish => dish.state === 'READY' || dish.state === 'SERVING')
            .sort(
              (a, b) =>
                new Date(a.readyTime).getTime() -
                new Date(b.readyTime).getTime()
            )
          this.setState({
            dishQue: newDishQue,
          })
          switch (target.state) {
            case 'SERVED':
              notification['success']({
                message: target.name + ' served!',
                description: 'Dish id: ' + target._id + ' By waiter: ', // TODO: get the user from message
                duration: 3,
              })
              break
            case 'READY':
              notification['success']({
                message: 'New dish: ' + target.name + ' ready!',
                description: 'Ordered by table: ' + target.tableId,
                duration: 3,
              })
              break
            default:
          }
          break
        case 'requestQue':
          const newRequestQue = objToArray(newObj)
            .filter(request => request.finishTime == null)
            .sort(
              (a, b) =>
                new Date(a.receiveTime).getTime() -
                new Date(b.receiveTime).getTime()
            )
          this.setState({
            requestQue: newRequestQue,
          })
          if (target.finishTime !== null) {
            notification['success']({
              message: 'Request from table ' + target.tableId + ' fulfilled',
              description: 'Handled by waiter: ', //TODO: get the user from message
              duration: 3,
            })
          }
          break
        default:
          return
      }
    }
  }

  componentDidMount() {
    const userData = { ...this.user }

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
            user={this.user}
          />
          <Request
            requestQue={arrayToObj(this.state.requestQue)}
            socket={this.state.socket}
            user={this.user}
          />
        </div>
      </div>
    )
  }
}

export default Waiter
