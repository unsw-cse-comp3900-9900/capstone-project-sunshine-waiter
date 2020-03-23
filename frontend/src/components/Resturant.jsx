import React from 'react'

import Nivagation from './Navigation'
import './Resturant.css'

class Restaurant extends React.Component {
  render() {
    return (
      <div className="restaurant">
        <img src={require('../resturant.jpg')} alt="" />
        <div className="welcome-message">
          <h1 className="ui inverted" style={{ fontSize: '70px' }}>
            Welcome to the Resturant
          </h1>
        </div>
        <div className="buttons">
          <Nivagation />
        </div>
      </div>
    )
  }
}

export default Restaurant
