import React from 'react'

import '../default.css'

class MyProfile extends React.Component {
  render() {
    const { userDetail } = this.props
    const { _id, name, avatar } = userDetail
    return (
      <div className="profile">
        <div className="basic">
          <div className="name">
            <img
              className="ui avatar image"
              src={require('../SWLogo.png')}
              alt=""
            />
            {name}
            <span>
              <i className="address card icon" />
            </span>
            <span className="clickable right">
              <i className="pencil alternate icon" />
            </span>
          </div>
          <div className="meta">UserID: {_id}</div>
        </div>
        <h4 className="ui horizontal divider">
          <i className="tag icon"></i>
          Dashboard
        </h4>
        <div className="my-restaurant">
          <h3>
            <i className="coffee icon" />
            My Restaurants
          </h3>
          <span>
            Restaurant 1
            <a href="/restaurants/1">
              <i className="caret square right icon" />
            </a>
          </span>
        </div>
        <div className="footer">
          <div className="ui red button">Delete My Account</div>
        </div>
      </div>
    )
  }
}

export default MyProfile
