import React from 'react'

import '../default.css'

class MyProfile extends React.Component {
  render() {
    const { onCloseProfile, userDetail } = this.props
    const { _id, name, avatar } = userDetail
    return (
      <div>
        <div>
          <div>
            <div>
              <img src="" alt="" />
              <div className="header">{name}</div>
              <div className="meta">{_id}</div>
            </div>
          </div>
        </div>
        <div>
          <label>My Restaurants</label>
          <li>
            <a href="/restaurants/1">Restaurant 1</a>
          </li>
        </div>
      </div>
    )
  }
}

export default MyProfile
