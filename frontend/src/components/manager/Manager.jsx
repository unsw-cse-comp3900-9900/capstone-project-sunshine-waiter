import React from 'react'
import { Layout, Menu, Button, Tooltip, Row, Col } from 'antd'
import 'antd/dist/antd.css'

import './default.css'
import { ContentType } from './Constant'
import MenuItemModal from './MenuItemModal'
import CategoryModal from './CategoryModal'
import { fetchMenuApi } from '../apis/actions/menus'
import { deleteCategoryItem } from '../apis/actions/category'
import { getCookie } from '../authenticate/Cookies'
import { deleteMenuItem } from '../apis/actions/menuItem'
import Dashboard from './dashBoard/dashBoard'
import StaffManagement from './staff/StaffManagement'

const { Header, Content, Sider } = Layout
const { DASHBOARD, STAFFS, MENUS, QRCODE } = ContentType

class Manager extends React.Component {
  state = {
    openCategoryId: '',
    displayIndex: DASHBOARD,
    showMenuItemModal: false,
    showCategoryModal: false,
    currentCategoryParam: null,
    currentMenuItemParam: null,
    currentMenu: null,
  }

  //fetch data before rendering the component
  UNSAFE_componentWillMount = () => {
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

  renderActiveMenuItem = category => {
    if (
      this.state.currentMenu === null ||
      this.state.currentMenu.menuItems.length === 0
    ) {
      return <div>Create a menuItem</div>
    }
    return (
      <div>
        {this.state.currentMenu.menuItems.map(item => {
          if (!item.isArchived) {
            return item.categoryArray.map(caId => {
              if (caId === category._id) {
                return (
                  <li key={item._id}>
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
                  </li>
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
          <h1>Edit your menu: {this.state.currentMenu.name}</h1>
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

  renderContent = () => {
    if (this.state.displayIndex === DASHBOARD) {
      return <Dashboard {...this.props} />
    }
    if (this.state.displayIndex === STAFFS) {
      const { id } = this.props.match.params
      return <StaffManagement restaurantId={id} />
    }
    if (this.state.displayIndex === MENUS) {
      return (
        <Row>
          <Col span={8}>{this.renderActiveMenu()}</Col>
          <Col span={8} push={0.5}>
            {this.renderArchivedMenu()}
          </Col>
          <Col span={8} push={0.5}>
            {this.renderArchivedMenuItem()}
          </Col>
        </Row>
      )
    }
    if (this.state.displayIndex === QRCODE) {
      return <div>code</div>
    }
  }

  render() {
    const { id } = this.props.match.params
    return (
      <Layout>
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
        <Header className="header">
          <h1>Hi, Manager! How do you feel today?</h1>
        </Header>
        <Layout>
          <Sider>
            <Menu className="sider-menu">
              <Menu.Item
                onClick={() => this.setState({ displayIndex: DASHBOARD })}
              >
                <i className="chart pie icon"></i>
                Dashboard
              </Menu.Item>
              <Menu.Item
                onClick={() => this.setState({ displayIndex: STAFFS })}
              >
                <i className="users icon"></i>
                Staff
              </Menu.Item>
              <Menu.Item onClick={() => this.setState({ displayIndex: MENUS })}>
                <i className="list icon"></i>
                Menu
              </Menu.Item>
              <Menu.Item
                onClick={() => this.setState({ displayIndex: QRCODE })}
              >
                <i className="qrcode icon"></i>
                QRCode
              </Menu.Item>
            </Menu>
          </Sider>
          <Content className="content">
            <div className="container">{this.renderContent()}</div>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default Manager
