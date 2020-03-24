import React, { useState } from 'react'

import MyProfile from './MyProfile'

const SiderBar = ({ visible, onCloseProfile }) => {
  return (
    <div className={visible ? 'ui right visible sidebar' : 'ui right sidebar'}>
      <MyProfile onCloseProfile={onCloseProfile} />
    </div>
  )
}

export default SiderBar
