import React from 'react'
import { Modal } from 'antd'

class PendingInvitationModal extends React.Component {
  render() {
    const { visible, onCancel } = this.props
    return (
      <Modal visible={visible} onCancel={onCancel}>
        <div>invitations</div>
      </Modal>
    )
  }
}

export default PendingInvitationModal
