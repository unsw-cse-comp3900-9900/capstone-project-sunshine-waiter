import React from 'react'

import MyProfile from './MyProfile'
import '../default.css'

const SiderBar = ({ visible, restaurants, updateState, updateRestaurants }) => {
  return (
    <div className={visible ? 'ui right visible sidebar' : 'ui right sidebar'}>
      <MyProfile
        updateState={updateState}
        updateRestaurants={updateRestaurants}
        restaurants={restaurants}
      />
    </div>
  )
}
// updateRestaurants={updateRestaurants}

export default SiderBar
