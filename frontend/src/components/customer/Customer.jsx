import React, { Component } from 'react'
import DishItemCard from './DishItemCard.js'
import Cart from './Cart.js'
import { getMenus } from './services/fakemenu'
import './my-drawer.css'

import { TabBar, List, Drawer, Icon, NavBar, Button } from 'antd-mobile'
import 'antd-mobile/dist/antd-mobile.css'
//import 'antd/dist/antd.css'
import { ShoppingCartOutlined } from '@ant-design/icons'

class Customer extends Component {
  state = {
    selectedTab: '1',
    hidden: false,
    fullScreen: false,
    menus: getMenus(),
    //currentDisplayCatogory: '1',
    colorlist: ['0', '1', '2'], //写死的，要改
    //open: true
    docked: false,
    orderlist: [], // put the order
    num_of_dishes: 1, // dishes in the cart
  }

  onDock = d => {
    this.setState({
      [d]: !this.state[d],
    })
  }

  onOpenChange = (...args) => {
    console.log(args)
    this.setState({ open: !this.state.open })
  }

  increaseorder = (e, num) => {
    this.setState({
      orderlist: [...this.state.orderlist, e],
      num_of_dishes: num,
    })
  }

  handleDeleteBtn(index) {
    console.log('delete' + { index })
    const orderlist = [...this.state.orderlist]
    orderlist.splice(index, 1)
    this.setState({
      orderlist: [...orderlist],
    })
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
    console.log(this.state.currentDisplayCatogory)
    console.log('currentDisplayCatogory')
    return uniqueItems.map(({ _id, name }) => (
      <TabBar.Item
        key={_id}
        title={name}
        //className="nav-text"
        //实现点击分类跳转
        //onClick={() => this.setState({ currentDisplayCatogory: _id })}
        icon={
          <div
            style={{
              width: '22px',
              height: '22px',
              background: 'green',
            }}
          />
        }
        selectedIcon={
          <div
            style={{
              width: '22px',
              height: '22px',
              background: 'blue',
            }}
          />
        }
        selected={this.state.selectedTab === this.state.colorlist[_id]}
        //badge={1}
        onPress={() => {
          this.setState({
            selectedTab: this.state.colorlist[_id],
          })
        }}
        data-seed="logId"
      >
        {this.renderContent(_id)}
      </TabBar.Item>
    ))
  }

  renderContent = displayIndex => {
    console.log('paole ' + displayIndex)

    return (
      <div>
        <div>
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
                    num_of_dishes={this.state.num_of_dishes}
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

  render() {
    const sidebar = (
      <List>
        {this.state.orderlist.map((item, index) => {
          return (
            <List.Item
              key={index}
              extra={
                <Button
                  onClick={() => this.handleDeleteBtn(index)}
                  type="ghost"
                  size="small"
                >
                  delete
                </Button>
              }
              //thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
            >
              {/* //差一个空格 。。。*/}
              {item}

              {this.state.num_of_dishes}
            </List.Item>
          )
        })}
      </List>
    )
    return (
      <div
        style={
          this.state.fullScreen
            ? { position: 'fixed', height: '100%', width: '100%', top: 0 }
            : { height: '800px' } //related to bar 固定位置
        }
      >
        {/* <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
          tabBarPosition="top"
        >
          {this.renderCategoryItems(this.getUniqueCategories())}
        </TabBar> */}
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => this.onDock('docked')}
          leftContent={
            <div className="icons-list">
              <ShoppingCartOutlined />
            </div>
          }
          rightContent={[
            <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
            // <Icon key="1" type="ellipsis" />,
          ]}
        >
          Sunshine-waiter
        </NavBar>

        {/* 要调整drawer的位置 */}
        <Drawer
          className="my-drawer"
          style={{ minHeight: document.documentElement.clientHeight }}
          //style={{ minHeight: '200px' }}
          enableDragHandle
          contentStyle={{
            color: '#A6A6A6',
            textAlign: 'center',
            paddingTop: 42,
            position: 'right',
          }}
          sidebar={sidebar}
          //open={this.state.open}
          //onOpenChange={this.onOpenChange}
          docked={this.state.docked}
        >
          <TabBar
            unselectedTintColor="#949494"
            tintColor="#33A3F4"
            barTintColor="white"
            hidden={this.state.hidden}
            tabBarPosition="top"
          >
            {this.renderCategoryItems(this.getUniqueCategories())}
          </TabBar>
        </Drawer>
      </div>
    )
  }
}

export default Customer
