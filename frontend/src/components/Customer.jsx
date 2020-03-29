import React, { Component } from 'react'
import { Layout, Menu, Button } from 'antd'
import 'antd/dist/antd.css'

import { getMenus } from '../services/fakemenu'
import DishItemCard from './DishItemCard'
import Cart from './Cart'
import './Default.css'
import './CustomerLayout.css'

const { Sider, Content, Header, Footer } = Layout
const { SubMenu } = Menu
class Customer extends Component {
  state = {
    menus: getMenus(),
    currentDisplayCatogory: '1',
    activeItem: '0',
    order_list: [],
  }

  //update orderlist
  increaseorder = e => {
    console.log('test')

    this.setState({
      order_list: [...this.state.order_list, e],
    })
    console.log(this.state.order_list)
  }

  getUniqueCategories = () => {
    const uniqueCategoryItems = []
    const uniqueItemsId = []
    this.state.menus.map(({ category }) => {
      if (!uniqueItemsId.includes(category._id)) {
        uniqueCategoryItems.push(category)
        uniqueItemsId.push(category._id)
      }
      return
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

  // cartFormat = () => {
  //   return (
  //     <Menu.Item
  //       key="0"
  //       className="nav-text"
  //       onClick={() => this.setState({ activeItem: '0' })}
  //     >
  //       <div className="ui icon button">
  //         <i className="cart plus icon" />
  //       </div>
  //     </Menu.Item>
  //   )
  // }

  renderCart = displayorder => {
    console.log('test_order' + displayorder)

    return (
      <div>
        <div className="ui for cart">
          <h1>hello cart</h1>
          <i>{displayorder}</i>
        </div>
      </div>
    )
  }

  renderMenuItem = displayIndex => {
    console.log('paole ' + displayIndex)

    return (
      <div>
        <div className="ui four cards">
          {this.state.menus.map(
            ({ title, description, image, category, cost, index }) => {
              return (
                category._id === displayIndex && (
                  <DishItemCard
                    title={title}
                    description={description}
                    cost={cost}
                    image={image}
                    key={title}
                    getorder={this.increaseorder}
                  />
                )
              )
            }
          )}
        </div>
      </div>
    )
  }

  renderOrderItem = displayItems => {}

  handleDeleteBtn(index) {
    console.log('delete' + { index })
    const order_list = [...this.state.order_list]
    order_list.splice(index, 1)
    this.setState({
      order_list: [...order_list],
    })
  }

  render() {
    return (
      <Layout>
        {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
        <Sider className="sider category">
          <div className="ui inverted segment category-bar">
            <div className="ui inverted right mini icon input">
              <input type="text" placeholder="Search your needs..." />
              <i className="search icon" />
            </div>
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            {/* {this.cartFormat()} */}
            {this.renderCategoryItems(this.getUniqueCategories())}
          </Menu>
          <Menu
            onClick={e => {
              console.log('click', e)
            }}
            theme="dark"
            mode="vertical"
          >
            <SubMenu
              key="sub1"
              style={{
                position: 'relative',
                bottom: '10px',
              }}
              title={
                <span className="ui bottom icon button">
                  <i className="cart plus icon" />
                </span>
              }
            >
              {this.state.order_list.map((item, index) => {
                return (
                  <Menu.Item key={index}>
                    {item}
                    <i>
                      <Button onClick={() => this.handleDeleteBtn(index)}>
                        delete
                      </Button>
                    </i>
                  </Menu.Item>
                )
              })}
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className="site-layout layout-position">
          {/* <Header className="header">Welcome to the menu!</Header> */}
          <Content className="site-layout-background content">
            <div className="ui container">
              {this.renderMenuItem(this.state.currentDisplayCatogory)}
            </div>
          </Content>
          <Footer className="footer">
            Copyright ©2020 by Sunshine Waiter in Syndey, AU
          </Footer>
        </Layout>
      </Layout>
    )
  }
}

export default Customer
