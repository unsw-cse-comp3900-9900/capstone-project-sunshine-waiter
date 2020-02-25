import React from 'react'

import Nivagation from './Navigation'
import './Resturant.css'

const Restaurant = () => {
  return (
    <div className="homepage">
      <h1 className="ui inverted header" style={{ fontSize: '70px' }}>
        Welcome to the Resturant
      </h1>
      <Nivagation />
    </div>
  )
}

export default Restaurant
