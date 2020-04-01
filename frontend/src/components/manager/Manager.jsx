import React from 'react'
import { Layout, Menu, Button, Tooltip } from 'antd'
import 'antd/dist/antd.css'

import './default.css'
import { ContentType } from './Constant'

const { Header, Content, Sider } = Layout
const { DASHBOARD, STAFFS, MENUS } = ContentType

class Manager extends React.Component {
  state = {
    openCategoryId: '',
    displayIndex: DASHBOARD,
    showMenuItemModal: false,
    showCategoryModal: false,
    currentMenu: {
      menuItems: [
        {
          _id: '5b21ca3eeb7f6fbccd471821',
          name: 'Tuna Sandwich',
          description: 'Serving with australia tuna and fresh vegetables',
          ingredients: ['garlic'],
          cost: 30,
          category: { _id: '1', name: 'Sandwich' },
          image: '../services/statics/SeafoodPasta.jpg',
          alt: 'Seafood Pasta',
          note: 'Available after 10:30am at participating restaurants',
          href: '/menu/tuna-sandwich',
        },
      ],
      categories: [
        {
          _id: '1',
          name: 'Roseberry Sandwich',
          description: 'With roseberry and jam',
          note: 'Available after 10:30am at participating restaurants',
          cost: 20,
        },
        {
          _id: '2',
          name: 'Sandwich',
          description: 'With roseberry and jam',
          note: 'Available after 10:30am at participating restaurants',
          cost: 20,
        },
      ],
      _id: '5e82e46eddcb38002f6926ff',
      name: 'menu',
      restaurant: '5e82e46eddcb38002f6926fe',
      __v: 0,
    },
  }

  renderMenuItem = category => {
    if (this.state.currentMenu.menuItems.length === 0) {
      return <div>add menuItem</div>
    }
    return (
      <div>
        {this.state.currentMenu.menuItems.map(item => {
          if (item.category._id === category._id) {
            return (
              <li key={item._id}>
                {item.name}
                <span>{item.cost}</span>
              </li>
            )
          }
        })}
      </div>
    )
  }

  onOpenChange = clickId => {
    if (this.state.openCategoryId && this.state.openCategoryId === clickId)
      this.setState({ openCategoryId: '' })
    else this.setState({ openCategoryId: clickId })
  }

  handleMenuItemEdit = clickId => {
    this.onOpenChange(clickId)
    this.setState({
      showMenuItemModal: true,
    })
  }

  handleCategoryEdit = () => {
    this.setState({
      showCategoryModal: true,
    })
  }

  renderCategories = () => {
    if (this.state.currentMenu.categories.length === 0) {
      return <div>add your menu</div>
    }
    return this.state.currentMenu.categories.map(item => (
      <div className="menu-content" key={item._id}>
        <label>{item.name}</label>
        <Tooltip
          placement="topLeft"
          title="display all menu items"
          arrowPointAtCenter
        >
          <span className="right" onClick={() => this.onOpenChange(item._id)}>
            {this.state.openCategoryId === item._id ? (
              <i className="clickable chevron up icon" />
            ) : (
              <i class="clickable chevron down icon" />
            )}
          </span>
        </Tooltip>
        <Tooltip
          placement="topLeft"
          title="create a menu item"
          arrowPointAtCenter
        >
          <span
            className="right"
            onClick={() => this.handleMenuItemEdit(item._id)}
          >
            <i className="clickable plus circle icon"></i>
          </span>
        </Tooltip>
        <Tooltip
          placement="topLeft"
          title="change the category"
          arrowPointAtCenter
        >
          <span className="right" onClick={this.handleCategoryEdit}>
            <i className="clickable pencil alternate icon"></i>
          </span>
        </Tooltip>
        {this.state.openCategoryId === item._id && this.renderMenuItem(item)}
      </div>
    ))
  }

  renderMenuBuilder = () => {
    if (this.state.currentMenu === {}) {
      return <div>Create your menu</div>
    }
    return (
      <div className="menu-builder">
        <h1>Edit your menu</h1>
        <div className="menu-segment">{this.renderCategories()}</div>
        <Button type="primary" shape="round" className="button">
          New Category
        </Button>
      </div>
    )
  }

  renderContent = () => {
    if (this.state.displayIndex === DASHBOARD) {
      return <div>Report</div>
    }
    if (this.state.displayIndex === STAFFS) {
      return <div>staff</div>
    }
    if (this.state.displayIndex === MENUS) {
      return <div>{this.renderMenuBuilder()}</div>
    }
  }

  render() {
    return (
      <Layout>
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
