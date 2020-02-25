import React from 'react'

const NotFound = props => {
  return (
    <React.Fragment>
      <h1>Not Found</h1>
      <div>{props.children}</div>
    </React.Fragment>
  )
}

export default NotFound
