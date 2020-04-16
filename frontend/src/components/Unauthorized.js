import React from 'react'

export default class Unauthorized extends React.Component {
  render() {
    return (
      <div className="ui massive error message">
        <h1 className="Header">Not Authorized</h1>
        <h6 style={{ textAlign: 'center' }}>Please contact the manager</h6>
      </div>
    )
  }
}
