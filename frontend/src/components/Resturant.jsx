import React from 'react'

import Nivagation from './Navigation'
import LoginButton from './LoginButton'
import './Resturant.css'

class Restaurant extends React.Component {
  state = { isAuthenticated: false }

  render() {
    return (
      <div className="homepage">
        <h1 className="ui inverted header" style={{ fontSize: '70px' }}>
          Welcome to the Resturant
        </h1>
        {this.state.isAuthenticated ? (
          <Nivagation />
        ) : (
          <LoginButton isAuthenticated={this.state.isAuthenticated} />
        )}
      </div>
    )
  }
}

export default Restaurant
