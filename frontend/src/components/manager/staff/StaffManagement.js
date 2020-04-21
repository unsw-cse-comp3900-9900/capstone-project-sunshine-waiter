import React from 'react'
import { Select, Row, Col } from 'antd'
import _ from 'lodash'
import 'antd/dist/antd.css'

import './staff.css'
import { sendInvitation, sendDismiss } from '../../apis/actions/invitation'
import { getCookie } from '../../authenticate/Cookies'
import { getSingleRestaurant } from '../../apis/actions/restaurants'
import StaffItemCard from './StaffItemCard'
import { Polling } from '../../apis/Polling'
import Spinner from '../../Spinner'

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

  componentDidMount = () => {
    const { restaurantId } = this.props

    Polling(
      timer =>
        getSingleRestaurant(
          getCookie('token'),
          restaurantId,
          this.onSetRestaurant
        ),
      5000
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

  onSendDismiss = async (e) => {
    e.preventDefault()
    this.setState({
      sending: true,
    })

    const { restaurantId } = this.props
    await sendDismiss(
      getCookie('token'),
      restaurantId,
      _.pick(this.state, ['email', 'role']),
      this.onFinishSend
    )
  }

  renderDismissBlock = () => {
    return (
      <div>
        <h1>Dissmiss a staff</h1>
        <div className="invitation-block">
          <form className="ui form" onSubmit={this.onSendDismiss}>
            <div className="field field-block" style={{ marginTop: '10px' }}>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                placeholder="Input the email of the staff you want to dismiss."
                value={this.state.email}
                onChange={(e) =>
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
                onChange={(e) =>
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

  renderInvitationBlock = () => {
    return (
      <div>
        <h1>Make an Invitation</h1>
        <div className="invitation-block">
          <form className="ui form" onSubmit={this.onSend}>
            <div className="field field-block" style={{ marginTop: '10px' }}>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                placeholder="Input the email of the user you want to invite."
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
      return <Spinner />
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
      return <Spinner />
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
      return <Spinner />
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
        <Row>
          <Col push={4}>{this.renderDismissBlock()}</Col>
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
