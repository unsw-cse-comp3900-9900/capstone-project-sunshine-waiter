import React from 'react'

import Nivagation from './Navigation'
import './Resturant.css'
import { getSingleRestaurant } from './apis/actions/restaurants'
import { getCookie } from './authenticate/Cookies'

class Restaurant extends React.Component {
  state = {
    currentRestaurant: {
      name: '',
      description: '',
    },
  }

  onSetState = data => {
    this.setState({
      currentRestaurant: data,
    })
  }

  UNSAFE_componentWillMount = () => {
    const { id } = this.props.match.params
    getSingleRestaurant(getCookie('token'), id, this.onSetState)
  }

  render() {
    const { id } = this.props.match.params
    const { name, description } = this.state.currentRestaurant

    return (
      <div className="restaurant">
        <img src={require('../resturant.jpg')} alt="" />
        <div className="welcome-message">
          <h1 className="ui inverted" style={{ fontSize: '70px' }}>
            Welcome to the {name}
          </h1>
          <small>{description}</small>
        </div>
        <div className="buttons">
          <Nivagation id={id} />
        </div>
      </div>
    )
  }
}

export default Restaurant
