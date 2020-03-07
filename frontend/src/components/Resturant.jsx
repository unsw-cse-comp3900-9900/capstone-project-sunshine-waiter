import React from 'react'

import GoogleAuth from './authenticate/GoogleAuth'
import './Resturant.css'

class Restaurant extends React.Component {
  render() {
    return (
      <div className="homepage">
        <h1 className="ui inverted header" style={{ fontSize: '70px' }}>
          Welcome to the Resturant
        </h1>
        <GoogleAuth />
      </div>
    )
  }
}

export default Restaurant
