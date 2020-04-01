import React from 'react'
import { Modal } from 'antd'

import { createCategoryItem } from '../apis/actions/category'
import { getCookie } from '../authenticate/Cookies'

class CategoryModal extends React.Component {
  state = {
    name: '',
    description: '',
  }

  onSubmit = () => {
    createCategoryItem(
      getCookie('token'),
      this.props.restaurantId,
      this.state,
      this.props.onCancel()
    )
  }

  render() {
    const { visible, onCancel } = this.props
    return (
      <Modal visible={visible} onCancel={onCancel} onOk={this.onSubmit}>
        <form className="ui form" onSubmit={this.onSubmit}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={this.state.name}
              onChange={e =>
                this.setState({
                  name: e.target.value,
                })
              }
            />
            <small>The name has to be more than 5 letters?</small>
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              value={this.state.description}
              onChange={e =>
                this.setState({
                  description: e.target.value,
                })
              }
            />
            <small>The description has to be more than 5 letters?</small>
          </div>
        </form>
      </Modal>
    )
  }
}

export default CategoryModal
