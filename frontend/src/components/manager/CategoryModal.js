import React from 'react'
import { Modal } from 'antd'

import {
  createCategoryItem,
  updateCategoryItem,
} from '../apis/actions/category'
import { getCookie } from '../authenticate/Cookies'

class CategoryModal extends React.Component {
  state = {
    name: '',
    description: '',
  }

  _id = ''

  onSubmit = async e => {
    e.preventDefault()
    const { onFetchCurrentMenu } = this.props

    if (this._id) {
      await updateCategoryItem(
        getCookie('token'),
        this.props.restaurantId,
        this._id,
        this.state
      )
    } else {
      await createCategoryItem(
        getCookie('token'),
        this.props.restaurantId,
        this.state
      )
    }
    onFetchCurrentMenu()
    this.props.onCancel()
  }

  UNSAFE_componentWillReceiveProps = nextProps => {
    const { currentParam } = nextProps

    if (currentParam !== null) {
      this._id = currentParam._id
      this.setState({
        name: currentParam.name,
        description: currentParam.description,
      })
    } else {
      this._id = ''
      this.setState({
        name: '',
        description: '',
      })
    }
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
