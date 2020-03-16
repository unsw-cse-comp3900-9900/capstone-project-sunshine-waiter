import React, { Component } from 'react'
import { Layout, Menu } from 'antd'
import 'antd/dist/antd.css'

import { getMenus } from '../services/fakemenu'
import DishItemCard from './DishItemCard'
import './Customer.css'

const { Sider, Content, Header, Footer } = Layout

class Customer extends Component {
  state = {
    menus: getMenus(),
  }

  renderMenuItem = () => {
    return (
      <div>
        <div className="ui four cards">
          {this.state.menus.map(({ title, description, image }) => (
            <DishItemCard
              title={title}
              description={description}
              image={image}
              key={title}
            />
          ))}
        </div>
      </div>
    )
  }

  render() {
    return (
      <Layout>
        <Sider className="sider category">
          <div className="ui inverted segment category-bar">
            <div className="ui inverted right mini icon input">
              <input type="text" placeholder="Search your needs..." />
              <i className="search icon" />
            </div>
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
            <Menu.Item key="1">
              <span className="nav-text">Sandwish</span>
            </Menu.Item>
            <Menu.Item key="2">
              <span className="nav-text">Pasta</span>
            </Menu.Item>
            <Menu.Item key="3">
              <span className="nav-text">Rice</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout layout-position">
          <Header className="header">Welcome to the menu!</Header>
          <Content className="site-layout-background content">
            <div className="ui container">{this.renderMenuItem()}</div>
          </Content>
          <Footer className="footer">
            Copyright ©2020 by Sunshine Waiter in Syndey, AU
          </Footer>
        </Layout>
        {/* <Sider className="sider cart">
          <div className="ui container"> Cart</div>
        </Sider> */}
      </Layout>
    )
  }
}

export default Customer
