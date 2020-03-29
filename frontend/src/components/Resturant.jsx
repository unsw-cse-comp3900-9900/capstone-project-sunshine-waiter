import React from 'react'

import Nivagation from './Navigation'
import './Resturant.css'

class Restaurant extends React.Component {
  render() {
    const { details } = this.props
    const { _id, name, description } = details
    console.log('sds', details)
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
          <Nivagation id={_id} />
        </div>
      </div>
    )
  }
}

export default Restaurant
