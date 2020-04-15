import React from 'react'

import MyProfile from './MyProfile'
import '../default.css'

const SiderBar = ({ visible, restaurants, updateState }) => {
  return (
    <div className={visible ? 'ui right visible sidebar' : 'ui right sidebar'}>
      <MyProfile updateState={updateState} restaurants={restaurants} />
    </div>
  )
}

export default SiderBar
