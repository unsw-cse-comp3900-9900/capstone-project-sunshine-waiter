import React from 'react'
import { Spin } from 'antd'

import './Default.css'

const Spinner = () => {
  return (
    <div className="spinner">
      <Spin tip="Loading..."></Spin>
    </div>
  )
}

export default Spinner
