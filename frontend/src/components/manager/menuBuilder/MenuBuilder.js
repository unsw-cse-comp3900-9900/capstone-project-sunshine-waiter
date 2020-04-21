import React from 'react'
import { Button, Tooltip, Row, Col } from 'antd'

import { fetchMenuApi } from '../../apis/actions/menus'
import { deleteMenuItem } from '../../apis/actions/menuItem'
import { deleteCategoryItem } from '../../apis/actions/category'
import MenuItemModal from './MenuItemModal'
import CategoryModal from './CategoryModal'
import '../default.css'
import './menuItem.css'
import { getCookie } from '../../authenticate/Cookies'
import ImageUploadModal from '../../imageUpload/ImageUploadModal'

const baseURL = 'http://localhost:8000'

class MenuBuilder extends React.Component {
  state = {
    openCategoryId: '',
    showMenuItemModal: false,
    showCategoryModal: false,
    currentCategoryParam: null,
    currentMenuItemParam: null,
    currentMenu: null,
    showImageUploadModal: false,
  }

  componentDidMount = () => {
    this.onFetchCurrentMenu()
  }

  onSetCurrentMenu = data => {
    this.setState({
      currentMenu: data,
    })
  }

  onFetchCurrentMenu = async () => {
    const { id } = this.props.match.params
    await fetchMenuApi(getCookie('token'), id, this.onSetCurrentMenu)
  }

  renderImage = item => {
    const { id } = this.props.match.params
    const { img } = item

    //backend api is a bit buggy, but the workaround is that no orginalname, then no image uploaded yet
    if (img.originalname !== undefined) {
      return (
        <span
          className="clickable"
          onClick={() =>
            this.setState({
              showImageUploadModal: true,
            })
          }
        >
          <img
            className="ui avatar image"
            src={baseURL + `/restaurants/${id}` + img.relativePath}
          />
        </span>
      )
    }

    return (
      <span
        className="clickable"
        onClick={() =>
          this.setState({
            showImageUploadModal: true,
          })
        }
      >
        <img
          className="ui avatar image"
          src={require('../../homepage/SWLogo.png')}
        />
      </span>
    )
  }

  renderActiveMenuItem = category => {
    const { id: restaurantId } = this.props.match.params

    if (
      this.state.currentMenu === null ||
      this.state.currentMenu.menuItems.length === 0
    ) {
      return <div>Create a menuItem</div>
    }
    return (
      <div className="ui items">
        {this.state.currentMenu.menuItems.map(item => {
          if (!item.isArchived) {
            return item.categoryArray.map(caId => {
              if (caId === category._id) {
                return (
                  <div className="item item-box" key={item._id}>
                    <ImageUploadModal
                      visible={this.state.showImageUploadModal}
                      onCancel={() =>
                        this.setState({
                          showImageUploadModal: false,
                        })
                      }
                      tag="menuItem"
                      params={{
                        token: getCookie('token'),
                        restaurantId,
                        menuItemId: item._id,
                      }}
                    />
                    {this.renderImage(item)}
                    <div className="middle aligned">
                      <Tooltip
                        placement="topLeft"
                        title={`price is ${item.price}`}
                        arrowPointAtCenter
                      >
                        {item.name}
                      </Tooltip>
                      <Tooltip
                        placement="topLeft"
                        title="modify the menuItem"
                        arrowPointAtCenter
                      >
                        <span
                          className="right"
                          onClick={() => {
                            this.setState({ currentMenuItemParam: item })
                            this.handleMenuItemEdit()
                          }}
                        >
                          <i className="clickable pencil alternate icon"></i>
                        </span>
                      </Tooltip>
                      <Tooltip
                        placement="topLeft"
                        title="delete the menuItem"
                        arrowPointAtCenter
                      >
                        <span
                          className="right"
                          onClick={() => this.onDeleteMenuItem(item._id)}
                        >
                          <i className="clickable trash icon"></i>
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                )
              }
            })
          }
        })}
      </div>
    )
  }

  renderArchivedMenuItem = () => {
    if (
      this.state.currentMenu === null ||
      this.state.currentMenu.menuItems.length === 0
    ) {
      return null
    }
    return (
      <div className="menu-builder">
        <div>
          <h1>Archived MenuItems</h1>
        </div>
        <div className="menu-segment">
          {this.state.currentMenu.menuItems.map(item => {
            if (item.isArchived) {
              return (
                <li key={item._id}>
                  <Tooltip
                    placement="topLeft"
                    title={`price is ${item.price}`}
                    arrowPointAtCenter
                  >
                    {item.name}
                  </Tooltip>
                </li>
              )
            }
          })}
        </div>
      </div>
    )
  }

  onOpenChange = clickId => {
    if (this.state.openCategoryId && this.state.openCategoryId === clickId)
      this.setState({ openCategoryId: '' })
    else this.setState({ openCategoryId: clickId })
  }

  handleMenuItemEdit = () => {
    this.setState({
      showMenuItemModal: true,
    })
  }

  onCloseMenuItemModal = () => {
    this.setState({
      showMenuItemModal: false,
    })
  }

  onDeleteMenuItem = async menuItemId => {
    const { id } = this.props.match.params
    await deleteMenuItem(
      getCookie('token'),
      id,
      menuItemId,
      this.onFetchCurrentMenu
    )
  }

  handleCategoryEdit = () => {
    this.setState({
      showCategoryModal: true,
    })
  }

  onCloseCategoryModal = () => {
    this.setState({
      showCategoryModal: false,
    })
  }

  onDeleteCategory = async categoryId => {
    const { id } = this.props.match.params
    await deleteCategoryItem(
      getCookie('token'),
      id,
      categoryId,
      this.onFetchCurrentMenu
    )
  }

  renderActiveCategories = () => {
    if (
      this.state.currentMenu === null ||
      this.state.currentMenu.categories.length === 0
    ) {
      return (
        <div className="ui floating message menu-tips">
          <p>Create your first category</p>
        </div>
      )
    }
    return this.state.currentMenu.categories.map(item => {
      if (!item.isArchived) {
        return (
          <div className="menu-content" key={item._id}>
            <label>{item.name}</label>
            <Tooltip
              placement="topLeft"
              title="display all menu items"
              arrowPointAtCenter
            >
              <span
                className="right"
                onClick={() => this.onOpenChange(item._id)}
              >
                {this.state.openCategoryId === item._id ? (
                  <i className="clickable chevron up icon" />
                ) : (
                  <i className="clickable chevron down icon" />
                )}
              </span>
            </Tooltip>
            <Tooltip
              placement="topLeft"
              title="modify the category"
              arrowPointAtCenter
            >
              <span
                className="right"
                onClick={() => {
                  this.setState({ currentCategoryParam: item })
                  this.handleCategoryEdit()
                }}
              >
                <i className="clickable pencil alternate icon"></i>
              </span>
            </Tooltip>
            <Tooltip
              placement="topLeft"
              title="delete the category"
              arrowPointAtCenter
            >
              <span
                className="right"
                onClick={() => this.onDeleteCategory(item._id)}
              >
                <i className="clickable trash icon"></i>
              </span>
            </Tooltip>
            {this.state.openCategoryId === item._id &&
              this.renderActiveMenuItem(item)}
          </div>
        )
      }
    })
  }

  renderArchivedCategories = () => {
    if (
      this.state.currentMenu === null ||
      this.state.currentMenu.categories.length === 0
    ) {
      return null
    }
    return this.state.currentMenu.categories.map(item => {
      if (item.isArchived) {
        return (
          <div className="menu-content" key={item._id}>
            <label>{item.name}</label>
          </div>
        )
      }
    })
  }

  renderActiveMenu = () => {
    if (this.state.currentMenu === null) {
      return (
        <div className="ui red message">
          The menu is null, pls contact the admin!
        </div>
      )
    }
    return (
      <div className="menu-builder">
        <div>
          {/* get api dont return description key */}
          <h1>Active menu: {this.state.currentMenu.name}</h1>
        </div>
        <div className="menu-segment">{this.renderActiveCategories()}</div>
        <Button
          type="primary"
          shape="round"
          className="right menuItem-button"
          onClick={() => {
            this.setState({
              currentMenuItemParam: null,
            })
            this.handleMenuItemEdit()
          }}
        >
          New MenuItem
        </Button>
        <Button
          type="primary"
          shape="round"
          className="category-button"
          onClick={() => {
            this.setState({
              currentCategoryParam: null,
            })
            this.handleCategoryEdit()
          }}
        >
          New Category
        </Button>
      </div>
    )
  }

  renderArchivedMenu = () => {
    return (
      <div className="menu-builder">
        <div>
          <h1>Archived Categories</h1>
        </div>
        <div className="menu-segment">{this.renderArchivedCategories()}</div>
      </div>
    )
  }

  render() {
    const { id } = this.props.match.params
    return (
      <div>
        <MenuItemModal
          visible={this.state.showMenuItemModal}
          onCancel={this.onCloseMenuItemModal}
          restaurantId={id}
          currentParam={this.state.currentMenuItemParam}
          onFetchCurrentMenu={this.onFetchCurrentMenu}
          currentMenu={this.state.currentMenu}
        />
        <CategoryModal
          visible={this.state.showCategoryModal}
          onCancel={this.onCloseCategoryModal}
          restaurantId={id}
          currentParam={this.state.currentCategoryParam}
          onFetchCurrentMenu={this.onFetchCurrentMenu}
        />
        <Row>
          <Col span={24}>{this.renderActiveMenu()}</Col>
        </Row>
        <div className="ui clearing divider"></div>
        <Row>
          <Col span={24}>{this.renderArchivedMenu()}</Col>
        </Row>
        <div className="ui clearing divider"></div>
        <Row>
          <Col span={24}>{this.renderArchivedMenuItem()}</Col>
        </Row>
      </div>
    )
  }
}

export default MenuBuilder
