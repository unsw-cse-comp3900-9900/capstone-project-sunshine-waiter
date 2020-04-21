import React from 'react'
import { Button, Tooltip, Row, Col } from 'antd'

import { fetchMenuApi } from '../../apis/actions/menus'
import { deleteMenuItem } from '../../apis/actions/menuItem'
import { deleteCategoryItem } from '../../apis/actions/category'
import MenuItemModal from './MenuItemModal'
import CategoryModal from './CategoryModal'
import '../default.css'
import { getCookie } from '../../authenticate/Cookies'
import Spinner from '../../Spinner'
import MenuItemCard from './MenuItemCard'

class MenuBuilder extends React.Component {
  state = {
    openCategoryId: '',
    showMenuItemModal: false,
    showCategoryModal: false,
    currentCategoryParam: null,
    currentMenuItemParam: null,
    currentMenu: null,
    isLoading: true,
  }

  componentDidMount = () => {
    this.onFetchCurrentMenu()
  }

  onSetCurrentMenu = data => {
    this.setState({
      currentMenu: data,
      isLoading: false,
    })
  }

  onFetchCurrentMenu = async () => {
    const { id } = this.props.match.params
    await fetchMenuApi(getCookie('token'), id, this.onSetCurrentMenu)
  }

  renderActiveMenuItem = category => {
    if (
      this.state.currentMenu === null ||
      this.state.currentMenu.menuItems.length === 0
    ) {
      return <div>Create a menuItem</div>
    }
    return (
      <div className="ui four cards">
        {this.state.currentMenu.menuItems.map(item => {
          if (!item.isArchived) {
            return item.categoryArray.map(caId => {
              if (caId === category._id) {
                return (
                  <MenuItemCard
                    key={item._id}
                    {...this.props}
                    item={item}
                    categoryId={caId}
                    handleMenuItemEdit={this.handleMenuItemEdit}
                    currentMenu={this.state.currentMenu}
                    onSetCurrentMenuParam={this.onSetCurrentMenuParam}
                    onDeleteMenuItem={this.onDeleteMenuItem}
                  ></MenuItemCard>
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

  onSetCurrentMenuParam = data => {
    this.setState({ currentMenuItemParam: data })
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
    const { isLoading } = this.state
    if (isLoading) {
      return <Spinner />
    }
    if (!isLoading && this.state.currentMenu === null) {
      return (
        <div className="ui red message">
          The menu is null, pls contact the admin!
        </div>
      )
    }
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
