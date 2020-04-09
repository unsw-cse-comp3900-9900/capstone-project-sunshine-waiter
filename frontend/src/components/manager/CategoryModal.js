import React from 'react'
import { Modal, Select } from 'antd'

import {
  createCategoryItem,
  updateCategoryItem,
} from '../apis/actions/category'
import { getCookie } from '../authenticate/Cookies'

class CategoryModal extends React.Component {
  state = {
    name: '',
    description: '',
    isArchived: null,
    isPrivate: null,
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
        isArchived: currentParam.isArchived,
        isPrivate: currentParam.isPrivate,
      })
    } else {
      this._id = ''
      this.setState({
        name: '',
        description: '',
        isArchived: null,
        isPrivate: null,
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
          <div className="field">
            <label htmlFor="isArchived">isArchived</label>
            <Select
              size="small"
              style={{ width: 100 }}
              value={
                this.state.isArchived === null
                  ? this.state.isArchived
                  : this.state.isArchived
                  ? 'true'
                  : 'false'
              }
              onChange={e => {
                //convert string boolean to boolean
                const val = e === 'true'
                this.setState({
                  isArchived: val,
                })
              }}
            >
              <Select.Option key="true">true</Select.Option>
              <Select.Option key="false">false</Select.Option>
            </Select>
          </div>
          <div className="field">
            <label htmlFor="isPrivate">isPrivate</label>
            <Select
              size="small"
              style={{ width: 100 }}
              value={
                this.state.isPrivate === null
                  ? this.state.isPrivate
                  : this.state.isPrivate
                  ? 'true'
                  : 'false'
              }
              onChange={e => {
                //convert string boolean to boolean
                const val = e === 'true'
                this.setState({
                  isPrivate: val,
                })
              }}
            >
              <Select.Option key="true">true</Select.Option>
              <Select.Option key="false">false</Select.Option>
            </Select>
          </div>
        </form>
      </Modal>
    )
  }
}

export default CategoryModal
