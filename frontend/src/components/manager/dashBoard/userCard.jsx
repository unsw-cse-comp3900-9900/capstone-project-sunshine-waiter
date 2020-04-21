import React, { Component } from 'react'
import { Modal } from 'antd'
import getUser from './getUser'

class UserCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
    }
  }

  async componentDidMount() {
    const { userId } = this.props
    try {
      const user = await getUser(userId)
      const { name, email } = user
      this.setState({ name, email })
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const { userId, visible, handleVisible } = this.props
    const { name, email } = this.state
    return (
      <Modal
        title={name}
        visible={visible}
        onOk={() => handleVisible(userId)}
        onCancel={() => handleVisible(userId)}
        okText="OK"
        centered={true}
      >
        <h1>{name}</h1>
        <p>
          <span className="badge badge-pill badge-primary">Id:</span> {userId}
        </p>
        <p>
          <span className="badge badge-pill badge-primary">E-mail:</span>{' '}
          {email}
        </p>
      </Modal>
    )
  }
}

export default UserCard
