import React from 'react'

import MyProfile from './MyProfile'
import '../default.css'

const SiderBar = ({ visible, userDetail }) => {
  return (
    <div className={visible ? 'ui right visible sidebar' : 'ui right sidebar'}>
      <MyProfile userDetail={userDetail} />
    </div>
  )
}

export default SiderBar
