import React, { Component } from 'react'
import { Layout, Menu } from 'antd'
import 'antd/dist/antd.css'

import { getMenus } from '../services/fakemenu'
import DishItemCard from './DishItemCard'
import './Default.css'

const { Sider, Content, Header, Footer } = Layout

class Customer extends Component {
  state = {
    menus: getMenus(),
    currentDisplayCatogory: '1',
  }

  getUniqueCategories = () => {
    const uniqueCategoryItems = []
    const uniqueItemsId = []
    this.state.menus.map(({ category }) => {
      if (!uniqueItemsId.includes(category._id)) {
        uniqueCategoryItems.push(category)
        uniqueItemsId.push(category._id)
      }
    })
    return uniqueCategoryItems
  }

  renderCategoryItems = uniqueItems => {
    return uniqueItems.map(({ _id, name }) => (
      <Menu.Item
        key={_id}
        className="nav-text"
        onClick={() => this.setState({ currentDisplayCatogory: _id })}
      >
        {name}
      </Menu.Item>
    ))
  }

  renderMenuItem = displayIndex => {
    console.log('paole ' + displayIndex)

    return (
      <div>
        <div className="ui four cards">
          {this.state.menus.map(({ title, description, image, category }) => {
            return (
              category._id === displayIndex && (
                <DishItemCard
                  title={title}
                  description={description}
                  image={image}
                  key={title}
                />
              )
            )
          })}
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
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            {this.renderCategoryItems(this.getUniqueCategories())}
          </Menu>
        </Sider>
        <Layout className="site-layout layout-position">
          <Header className="header">Welcome to the menu!</Header>
          <Content className="site-layout-background content">
            <div className="ui container">
              {this.renderMenuItem(this.state.currentDisplayCatogory)}
            </div>
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
