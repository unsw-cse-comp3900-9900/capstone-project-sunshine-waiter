import React from 'react'

import MyProfile from './MyProfile'
import '../default.css'

const SiderBar = ({ visible, profile, updateState }) => {
  return (
    <div className={visible ? 'ui right visible sidebar' : 'ui right sidebar'}>
      <MyProfile profile={profile} updateState={updateState} />
    </div>
  )
}

export default SiderBar
