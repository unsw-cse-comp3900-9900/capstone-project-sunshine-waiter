import React from 'react'

import Nivagation from './Navigation'
import './restaurant.css'
import { getSingleRestaurant } from './apis/actions/restaurants'
import { getCookie } from './authenticate/Cookies'

class Restaurant extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentRestaurant: {
        name: '',
        description: '',
      },
    }

    const { id } = this.props.match.params
    getSingleRestaurant(getCookie('token'), id, this.onSetState)
  }

  onSetState = data => {
    this.setState({
      currentRestaurant: data,
    })
  }

  render() {
    const { id } = this.props.match.params
    const { name, description } = this.state.currentRestaurant

    return (
      <div className="restaurant">
        <div className="container center">
          <div className="row">
            <h1 className="text-left display-1 white text-shadow font-weight-bolder text-shadow">
              Welcome to
            </h1>
          </div>
          <div className="row">
            <h1 className="text-left display-4 white text-shadow">{name}</h1>
          </div>
          <div className="row">
            <footer class="blockquote-footer my-3 font-italic">
              {description}
            </footer>
          </div>
          <div className="row">
            <Nivagation id={id} />
          </div>
        </div>
      </div>
    )
  }
}

export default Restaurant
