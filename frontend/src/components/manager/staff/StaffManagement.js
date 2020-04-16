import React from 'react'
import { Select, Row, Col } from 'antd'
import _ from 'lodash'

import './staff.css'
import { sendInvitation } from '../../apis/actions/invitation'
import { getCookie } from '../../authenticate/Cookies'
import { getSingleRestaurant } from '../../apis/actions/restaurants'
import StaffItemCard from './StaffItemCard'

class StaffManagement extends React.Component {
  state = {
    email: '',
    role: 'cook',
    sending: false,
    restaurant: null,
  }

  onSetRestaurant = data => {
    this.setState({
      restaurant: data,
    })
  }

  UNSAFE_componentWillMount = async () => {
    const { restaurantId } = this.props
    await getSingleRestaurant(
      getCookie('token'),
      restaurantId,
      this.onSetRestaurant
    )
  }

  onFinishSend = () => {
    this.setState({
      sending: false,
    })
  }

  onSend = async e => {
    e.preventDefault()
    this.setState({
      sending: true,
    })

    const { restaurantId } = this.props
    await sendInvitation(
      getCookie('token'),
      restaurantId,
      _.pick(this.state, ['email', 'role']),
      this.onFinishSend
    )
  }

  renderInvitationBlock = () => {
    return (
      <div>
        <h1>Make an Invitation</h1>
        <div className="invitation-block">
          <form className="ui form" onSubmit={this.onSend}>
            <div className="field field-block" style={{ marginTop: '10px' }}>
              <label htmlFor="email">Inviting Email</label>
              <input
                type="text"
                id="email"
                placeholder="Input the email to send the invitation"
                value={this.state.email}
                onChange={e =>
                  this.setState({
                    email: e.target.value,
                  })
                }
              />
            </div>
            <div className="field field-block">
              <label htmlFor="role">Role</label>
              <Select
                id="role"
                size="small"
                style={{ width: 150 }}
                value={this.state.role}
                onChange={e =>
                  this.setState({
                    role: e,
                  })
                }
              >
                <Select.Option key="cook">cook</Select.Option>
                <Select.Option key="waiter">waiter</Select.Option>
                <Select.Option key="manager">manager</Select.Option>
              </Select>
              <small>Choose a role</small>
            </div>
            <button
              className={
                this.state.sending
                  ? 'my-button ui right loading primary button'
                  : 'my-button ui right primary button'
              }
            >
              Send
            </button>
          </form>
        </div>
      </div>
    )
  }

  renderCookList = () => {
    if (this.state.restaurant === null) {
      return null
    }
    return (
      <div className="ui items">
        {this.state.restaurant.userGroups.cook.map(id => (
          <StaffItemCard key={id} id={id} />
        ))}
      </div>
    )
  }

  renderWaiterList = () => {
    if (this.state.restaurant === null) {
      return null
    }
    return (
      <div className="ui items">
        {this.state.restaurant.userGroups.waiter.map(id => (
          <StaffItemCard key={id} id={id} />
        ))}
      </div>
    )
  }

  renderManagerList = () => {
    if (this.state.restaurant === null) {
      return null
    }
    return (
      <div className="ui items">
        {this.state.restaurant.userGroups.manager.map(id => (
          <StaffItemCard key={id} id={id} />
        ))}
      </div>
    )
  }

  render() {
    return (
      <div>
        <Row>
          <Col push={4}>{this.renderInvitationBlock()}</Col>
        </Row>
        <div className="ui clearing divider"></div>
        <Row>
          <Col span={8} push={1}>
            <h2>Cook List</h2>
            <div className="staff-box">{this.renderCookList()}</div>
          </Col>
          <Col span={8} push={1}>
            <h2>Waiter List</h2>
            <div className="staff-box">{this.renderWaiterList()}</div>
          </Col>
          <Col span={8} push={1}>
            <h2>Manager List</h2>
            <div className="staff-box">{this.renderManagerList()}</div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default StaffManagement
