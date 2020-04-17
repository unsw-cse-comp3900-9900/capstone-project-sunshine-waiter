import React from 'react'
import Dishes from './Dishes'
import Request from './Request'
import './Waiter.css'
import { notification } from 'antd'
import { connect } from '../apis/socketClient'
import getCurrentUser from '../getCurrentUser'
import { URL } from '../apis/webSocketUrl.json'
import { getCookie } from '../authenticate/Cookies'
import { getSingleRestaurant } from '../apis/actions/restaurants'
import { handleAuthority } from '../services'
import Unauthorized from '../Unauthorized'
import Spinner from '../Spinner'

export const arrayToObj = array => {
  let result = {}
  for (let item of array) {
    result[item._id] = item
  }
  return result
}

export const objToArray = obj => {
  let result = []
  for (let key in obj) {
    result.push(obj[key])
  }
  return result
}

export const WelcomeMessage = props => {
  return (
    <div>
      <h1 id="welcome-message">
        Hello {props.userName}! <br />
        Welcome to the {props.pageName} Page.
      </h1>
    </div>
  )
}

class Waiter extends React.Component {
  constructor(props) {
    super(props)
    this.user = {}
    this.state = {
      socket: null,
      dishQue: [],
      requestQue: [],
      authorized: false,
      isLoading: true,
    }
  }

  getRandomUserFrom = names => {
    let randomInt = Math.floor(Math.random() * names.length)
    return {
      restaurantId: 'restaurant1',
      _id: 'user' + randomInt.toString(),
      type: 'waiter',
      name: names[randomInt],
      password: 'password',
    }
  }

  initiate = (dishes, requests) => {
    this.setState({
      dishQue: objToArray(dishes)
        .filter(dish => dish.status === 'READY' || dish.status === 'SERVING')
        .sort(
          (a, b) =>
            new Date(a.readyTime).getTime() - new Date(b.readyTime).getTime()
        ),
      requestQue: objToArray(requests)
        .filter(request => request.finishTime == null)
        .sort(
          (a, b) =>
            new Date(a.receiveTime).getTime() -
            new Date(b.receiveTime).getTime()
        ),
    })
  }

  update = queName => {
    return target => {
      const newObj = arrayToObj(this.state[queName])
      newObj[target._id] = target
      switch (queName) {
        case 'dishQue':
          const newDishQue = objToArray(newObj)
            .filter(
              dish => dish.status === 'READY' || dish.status === 'SERVING'
            )
            .sort((a, b) => new Date(a.readyTime) - new Date(b.readyTime))
          this.setState({
            dishQue: newDishQue,
          })
          switch (target.status) {
            case 'SERVED':
              notification['success']({
                message: target.menuItem.name + ' served!',
                description:
                  'Dish id: ' +
                  target._id +
                  ' By waiter: ' +
                  target.servedBy.name,
                duration: 3,
              })
              break
            case 'READY':
              notification['success']({
                message: 'New dish: ' + target.menuItem.name + ' ready!',
                description: 'Ordered by table: ' + target.placedBy,
                duration: 3,
              })
              break
            default:
          }
          break
        case 'requestQue':
          const newRequestQue = objToArray(newObj)
            .filter(request => request.finishTime == null)
            .sort((a, b) => new Date(a.receiveTime) - new Date(b.receiveTime))
          this.setState({
            requestQue: newRequestQue,
          })
          if (target.finishTime !== null) {
            notification['success']({
              message: 'Request from table ' + target.tableId + ' fulfilled',
              description: 'Handled by waiter: ' + target.handleBy.name,
              duration: 3,
            })
          }
          break
        default:
          return
      }
    }
  }

  setUpUser = async () => {
    const user = await getCurrentUser()

    const { id: restaurantId } = this.props.match.params
    this.user = { ...user, restaurantId, type: 'waiter' }
  }

  async componentDidMount() {
    await this.setUpUser()

    //request authority
    const { id: restaurantId } = this.props.match.params

    getSingleRestaurant(getCookie('token'), restaurantId, data => {
      this.setState({
        isLoading: false,
      })
      handleAuthority(data, 'waiter', () => {
        this.setState({
          authorized: true,
        })
      })
    })

    const userData = { ...this.user }

    // configure includs the event and response you defined for the socket
    const configure = {
      'initiate data': this.initiate,
      'update dish': this.update('dishQue'),
      'update request': this.update('requestQue'),
    }

    try {
      connect(this, URL, userData, configure)
    } catch (error) {
      console.log({ error })
    }
  }

  componentWillUnmount() {
    if (this.state.socket) this.state.socket.close()
  }

  render() {
    if (this.state.isLoading) {
      return <Spinner />
    }
    if (!this.state.isLoading && !this.state.authorized) {
      return <Unauthorized />
    }
    return (
      <div>
        <header>
          <WelcomeMessage userName={this.user.name} pageName={'waiter'} />
        </header>
        <div className="box-container">
          <Dishes
            dishQue={this.state.dishQue}
            socket={this.state.socket}
            user={this.user}
          />
          <Request
            requestQue={this.state.requestQue}
            socket={this.state.socket}
            user={this.user}
          />
        </div>
      </div>
    )
  }
}

export default Waiter
