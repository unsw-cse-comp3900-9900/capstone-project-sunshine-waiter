import React from 'react'
import { Modal, Tag, Select } from 'antd'
import { TweenOneGroup } from 'rc-tween-one'
import _ from 'lodash'

import { createMenuItem, updateMenuItem } from '../apis/actions/menuItem'
import { getCookie } from '../authenticate/Cookies'

class MenuItemModal extends React.Component {
  state = {
    categoryInputVisble: false,
    categoryInputValue: '',
    //should be only active category
    categoryArray: [],
    name: '',
    description: '',
    note: '',
    price: 0,
    isPrivate: null,
  }

  _id = ''

  UNSAFE_componentWillReceiveProps = nextProps => {
    const { currentParam } = nextProps

    console.log('menuitemmodal->!!!!!!', currentParam)
    if (currentParam !== null) {
      const {
        _id,
        categoryArray,
        name,
        description,
        note,
        price,
        isPrivate,
      } = currentParam

      this._id = _id
      this.setState({
        categoryArray,
        name,
        description,
        note,
        price,
        isPrivate,
      })
    } else {
      this._id = ''
      this.setState({
        categoryArray: [],
        name: '',
        description: '',
        note: '',
        price: 0,
        isPrivate: null,
      })
    }
  }

  handleCategoryTagDelete = removedTagId => {
    const categoryArray = this.state.categoryArray.filter(
      ca => ca !== removedTagId
    )
    console.log(categoryArray)
    this.setState({ categoryArray: categoryArray })
  }

  showCategoryInput = () => {
    this.setState({ categoryInputVisble: true })
  }

  handleCategoryInputValueConfirm = () => {
    const { categoryInputValue } = this.state
    let activeCategoryArray = this.state.categoryArray.filter(
      ca => ca.isArchived === false
    )

    if (
      categoryInputValue &&
      activeCategoryArray.indexOf(categoryInputValue) === -1
    ) {
      activeCategoryArray = [...activeCategoryArray, categoryInputValue]
    }
    this.setState({
      categoryArray: activeCategoryArray,
      categoryInputVisble: false,
      categoryInputValue: '',
    })
  }

  getCategoryName = tag => {
    const { currentMenu } = this.props
    if (currentMenu !== null) {
      return currentMenu.categories.map(ca => {
        if (ca._id === tag) {
          return ca.name
        }
      })
    }
  }

  categoriesTagsMap = tag => {
    const tagElem = (
      <Tag
        closable
        onClose={e => {
          e.preventDefault()
          this.handleCategoryTagDelete(tag)
        }}
      >
        {this.getCategoryName(tag)}
      </Tag>
    )
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    )
  }

  renderSelctorOptions = () => {
    const { currentMenu } = this.props
    if (currentMenu === null) {
      return null
    } else {
      return currentMenu.categories.map(ca => {
        if (!ca.isArchived) {
          return <Select.Option key={ca._id}>{ca.name}</Select.Option>
        }
      })
    }
  }

  renderCategorySelector = () => {
    return (
      <Select
        size="small"
        style={{ width: 100 }}
        value={this.state.categoryInputValue}
        onChange={e => {
          this.setState({
            categoryInputValue: e,
          })
        }}
        onBlur={this.handleCategoryInputValueConfirm}
        onKeyDown={this.handleCategoryInputValueConfirm}
      >
        {this.renderSelctorOptions()}
      </Select>
    )
  }

  renderCategoryArray = () => {
    const { categoryInputVisble, categoryArray } = this.state
    const categoryChild = categoryArray.map(this.categoriesTagsMap)
    return (
      <div className="field">
        <label>CategoryArray</label>
        <div style={{ marginBottom: 16 }}>
          <TweenOneGroup
            enter={{
              scale: 0.8,
              opacity: 0,
              type: 'from',
              duration: 100,
              onComplete: e => {
                e.target.style = ''
              },
            }}
            leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
            appear={false}
          >
            {categoryChild}
          </TweenOneGroup>
          {categoryInputVisble ? (
            this.renderCategorySelector()
          ) : (
            <Tag onClick={this.showCategoryInput} className="site-tag-plus">
              <i className="tag icon" /> add CateTag
            </Tag>
          )}
        </div>
      </div>
    )
  }

  onSubmit = async e => {
    e.preventDefault()
    const { onFetchCurrentMenu } = this.props
    const param = _.pick(this.state, [
      'categoryArray',
      'name',
      'description',
      'note',
      'price',
      'isPrivate',
    ])

    if (this._id) {
      await updateMenuItem(
        getCookie('token'),
        this.props.restaurantId,
        this._id,
        param
      )
    } else {
      await createMenuItem(getCookie('token'), this.props.restaurantId, param)
    }

    onFetchCurrentMenu()
    this.props.onCancel()
  }

  render() {
    console.log('menuitemmodalrender')
    const { visible, onCancel } = this.props
    return (
      <Modal visible={visible} onCancel={onCancel} onOk={this.onSubmit}>
        <form className="ui form" onSubmit={this.onSubmit}>
          {this.renderCategoryArray()}
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

export default MenuItemModal
