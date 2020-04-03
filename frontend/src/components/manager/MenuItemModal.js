import React from 'react'
import { Modal, Tag, Input } from 'antd'
import { TweenOneGroup } from 'rc-tween-one'
import _ from 'lodash'

import { createMenuItem } from '../apis/actions/menuItem'
import { getCookie } from '../authenticate/Cookies'

class MenuItemModal extends React.Component {
  state = {
    categoryInputVisble: false,
    categoryInputValue: '',
    categoryArray: [],
    name: '',
    description: '',
    note: '',
    price: 0,
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
    let { categoryArray } = this.state
    if (
      categoryInputValue &&
      categoryArray.indexOf(categoryInputValue) === -1
    ) {
      categoryArray = [...categoryArray, categoryInputValue]
    }
    this.setState({
      categoryArray,
      categoryInputVisble: false,
      categoryInputValue: '',
    })
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
        {tag}
      </Tag>
    )
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    )
  }

  renderCategoryArray = () => {
    const {
      categoryInputVisble,
      categoryInputValue,
      categoryArray,
    } = this.state
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
            <Input
              type="text"
              size="small"
              style={{ width: 78 }}
              value={categoryInputValue}
              onChange={e =>
                this.setState({
                  categoryInputValue: e.target.value,
                })
              }
              onBlur={this.handleCategoryInputValueConfirm}
              onPressEnter={this.handleCategoryInputValueConfirm}
            />
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
    await createMenuItem(
      getCookie('token'),
      this.props.restaurantId,
      _.pick(this.state, [
        'categoryArray',
        'name',
        'description',
        'note',
        'price',
      ])
    )

    onFetchCurrentMenu()
    this.props.onCancel()
  }

  render() {
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
        </form>
      </Modal>
    )
  }
}

export default MenuItemModal
