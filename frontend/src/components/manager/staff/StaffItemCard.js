import React from 'react'

import { getUser } from '../../apis/actions/users'
import { getCookie } from '../../authenticate/Cookies'

class StaffItemCard extends React.Component {
  state = {
    staff: null,
  }

  onSetStaff = data => {
    this.setState({
      staff: data,
    })
  }

  UNSAFE_componentWillMount = async () => {
    const { id } = this.props
    await getUser(getCookie('token'), id, this.onSetStaff)
  }

  render() {
    if (this.state.staff === null) {
      return null
    }
    const { name, email, avatar } = this.state.staff
    return (
      <div className="item item-box">
        <img id="avater" src={require('../../homepage/SWLogo.png')} />
        <div className="middle aligned">
          <h4 style={{ fontSize: '80%' }}>{name}</h4>
          <small className="email" style={{ fontSize: '70%' }}>
            email: {email}
          </small>
        </div>
      </div>
    )
  }
}

export default StaffItemCard
