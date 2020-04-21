import React from 'react'
import ImageUpload from '../../ImageUploader'
import { Modal } from 'antd-mobile'

class ImageUploadModal extends React.Component {
  renderImageUpload = () => {
    const { restaurantId } = this.props
    const token = getCookie('token')
    const headers = {
      'x-auth-token': token,
    }
    const URL =
      'http://localhost:8000/restaurants/' +
      restaurantId +
      '/menuitems/' +
      this._id +
      '/img'
    return (
      <div className="field">
        <label>Image</label>
        <ImageUpload url={URL} headers={headers} />
      </div>
    )
  }

  render() {
    // const {visible, onClose} = this.props
    return <Modal>{this.renderImageUpload()}</Modal>
  }
}

export default ImageUploadModal
