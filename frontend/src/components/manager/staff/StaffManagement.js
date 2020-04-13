import React from 'react'
import { Select, Row, Col } from 'antd'
import _ from 'lodash'

import './staff.css'
import { sendInvitation } from '../../apis/actions/invitation'
import { getCookie } from '../../authenticate/Cookies'

class StaffManagement extends React.Component {
  state = {
    email: '',
    role: 'cook',
    sending: false,
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
    return <div>cook</div>
  }

  renderWaiterList = () => {
    return <div>waiter</div>
  }

  renderManagerList = () => {
    return <div>manager</div>
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
