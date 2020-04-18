import React from 'react'
import DishesToCook from './dishesToCook'
// import './kitchen.css'
import { notification } from 'antd'
import { objToArray, arrayToObj, WelcomeMessage } from '../Waiter/Waiter'
import { connect } from '../apis/socketClient'
import getCurrentUser from '../getCurrentUser'
import { URL } from '../apis/webSocketUrl.json'
import { getSingleRestaurant } from '../apis/actions/restaurants'
import { getCookie } from '../authenticate/Cookies'
import Spinner from '../Spinner'
import Unauthorized from '../Unauthorized'
import { handleAuthority } from '../services'

class Kitchen extends React.Component {
  constructor(props) {
    super(props)
    this.user = {}
    this.state = {
      socket: null,
      dishQue: [],
      authorized: false,
      isLoading: true,
    }
  }

  setUpUser = async () => {
    const user = await getCurrentUser()

    const { id: restaurantId } = this.props.match.params
    this.user = { ...user, restaurantId, type: 'cook' }
  }

  initiate = dishes => {
    console.log(dishes)
    this.setState({
      dishQue: objToArray(dishes)
        .filter(dish => dish.status === 'PLACED' || dish.status === 'COOKING')
        .sort(
          (a, b) => new Date(a.order.createAt) - new Date(b.order.createAt)
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
              dish => dish.status === 'PLACED' || dish.status === 'COOKING'
            )
            .sort(
              (a, b) => new Date(a.order.createAt) - new Date(b.order.createAt)
            )
          this.setState({
            dishQue: newDishQue,
          })
          switch (target.status) {
            case 'PLACED':
              notification['success']({
                message: target.name + ' ordered!',
                description:
                  'Dish id: ' + target._id + ' From table: ' + target.placedBy,
                duration: 3,
              })
              break
            case 'READY':
              notification['success']({
                message: 'Dish: ' + target.name + ' finished!',
                description: 'Cooked by: ' + target.cookedBy.name,
                duration: 3,
              })
              break
            default:
          }
          break
        default:
          return
      }
    }
  }

  async componentDidMount() {
    await this.setUpUser()

    //request authority
    const { id } = this.props.match.params

    getSingleRestaurant(getCookie('token'), id, data => {
      this.setState({
        isLoading: false,
      })

      handleAuthority(data, 'cook', () => {
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
    }

    try {
      connect(this, URL, userData, configure)
    } catch (error) {
      console.log({ error })
    }
  }

  componentWillUnmount() {
    this.state.socket.close()
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
          <WelcomeMessage userName={this.user.name} pageName={'kitchen'} />
        </header>
        <div className="box-container">
          <DishesToCook
            dishQue={this.state.dishQue}
            socket={this.state.socket}
            user={this.user}
          />
        </div>
      </div>
    )
  }
}

export default Kitchen
