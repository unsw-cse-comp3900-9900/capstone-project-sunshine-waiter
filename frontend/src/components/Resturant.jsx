import React from 'react'

import GoogleAuth from './authenticate/GoogleAuth'
import Nivagation from './Navigation'
import './Resturant.css'

class Restaurant extends React.Component {
  render() {
    return (
      <div>
        <img src={require('../resturant.jpg')} alt="" />
        <div className="welcome-message">
          <h1 className="ui inverted header" style={{ fontSize: '70px' }}>
            Welcome to the Resturant
          </h1>
        </div>
        <div className="buttons">
          <Nivagation />
          <GoogleAuth />
        </div>
      </div>
    )
  }
}

export default Restaurant
