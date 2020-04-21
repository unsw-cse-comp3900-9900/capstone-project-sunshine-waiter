import React from 'react'
import { Modal } from 'antd'
import jwtDecode from 'jwt-decode'

import ImageUpload from './ImageUploader'

class ImageUploadModal extends React.Component {
  URL = ''

  renderImageUpload = () => {
    const baseURL = 'http://localhost:8000'
    const { tag, params } = this.props
    const { token } = params

    if (tag === 'avatar') {
      const decodedJWT = jwtDecode(token)
      const userId = decodedJWT._id
      this.URL = baseURL + '/users/' + userId + '/img'
    }
    if (tag === 'menuItem') {
      const { restaurantId, menuItemId } = params
      this.URL = `${baseURL}/restaurants/${restaurantId}/menuItems/${menuItemId}/img`
    }

    const headers = {
      'x-auth-token': token,
    }

    return (
      <div>
        <label>Image</label>
        <ImageUpload url={this.URL} headers={headers} />
      </div>
    )
  }

  handleOk = () => {
    const { onCancel } = this.props
    onCancel()
  }

  render() {
    const { visible, onCancel } = this.props
    return (
      <Modal visible={visible} onCancel={onCancel} onOk={this.handleOk}>
        {this.renderImageUpload()}
      </Modal>
    )
  }
}

export default ImageUploadModal
