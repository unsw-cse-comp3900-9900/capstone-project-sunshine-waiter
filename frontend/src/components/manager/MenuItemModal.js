import React from 'react'
import { Modal } from 'antd'

import { createMenuItem } from '../apis/actions/menuItem'
import { getCookie } from '../authenticate/Cookies'

class MenuItemModal extends React.Component {
  state = {
    name: '',
    description: '',
    note: '',
    price: 0,
  }

  onSubmit = () => {
    createMenuItem(
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
          <div className="field">
            <label htmlFor="note">Note</label>
            <input
              type="text"
              id="note"
              value={this.state.note}
              onChange={e =>
                this.setState({
                  note: e.target.value,
                })
              }
            />
            <small>The note has to be more than 5 letters?</small>
          </div>
          <div className="field">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              value={this.state.price}
              onChange={e =>
                this.setState({
                  price: e.target.value,
                })
              }
            />
            <small>The price has to be more than 0?</small>
          </div>
        </form>
      </Modal>
    )
  }
}

export default MenuItemModal
