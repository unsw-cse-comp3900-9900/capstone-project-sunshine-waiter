import React, { Component } from 'react'
import DishItemCard from './DishItemCard.js'

import { getMenus } from './services/fakemenu'
import './my-drawer.css'

import {
  List,
  Drawer,
  Icon,
  NavBar,
  Button,
  Tabs,
  WhiteSpace,
} from 'antd-mobile'
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
    //colorlist: ['0', '1', '2'], //写死的，要改
    //open: true
    docked: false,
    orderlist: [], // put the order
    //num_of_dishes: 1, // dishes in the cart

    dic_order: new Map(), //store dishes,count
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
    if (this.state.dic_order.has(e)) {
      this.state.dic_order.set(e, this.state.dic_order.get(e) + num)
    } else {
      this.state.dic_order.set(e, num)
    }

    this.setState({
      orderlist: [...this.state.dic_order.keys()],
    })

    console.info('dic_order' + this.state.dic_order)
  }

  handleDeleteBtn(index, item) {
    console.log('delete' + index)
    const orderlist = [...this.state.orderlist]
    orderlist.splice(index, 1)
    this.state.dic_order.delete(item)
    this.setState({
      orderlist: [...orderlist],
      dic_order: this.state.dic_order,
    })
  }

  // getUniqueCategories = () => {
  //   const uniqueCategoryItems = []
  //   const uniqueItemsId = []
  //   this.state.menus.map(({ category }) => {
  //     if (!uniqueItemsId.includes(category._id)) {
  //       uniqueCategoryItems.push(category)
  //       uniqueItemsId.push(category._id)
  //     }
  //   })
  //   for (var i = 0; i < uniqueCategoryItems.length; i++) {
  //     console.log('uniqueitems->name:' + uniqueCategoryItems.name)
  //     for (var k in uniqueCategoryItems[i]) {
  //       console.log('uniqueitems' + uniqueCategoryItems[i][k])
  //     }
  //   }
  //   //console.log('uniqueitems' + uniqueCategoryItems)
  //   return uniqueCategoryItems
  // }

  getCategories = () => {
    const categoryList = new Map()
    this.state.menus.map(({ category }) => {
      if (!categoryList.has(category)) {
        categoryList.set(category._id, category.name)
        //categoryList[category._id] = category.name
      }
    })

    return [...categoryList.values()]
  }

  // renderCategoryItems = uniqueItems => {
  //   return uniqueItems.map(({ _id, name }) => (
  //     <TabBar.Item
  //       key={_id}
  //       title={name}
  //       //className="nav-text"
  //       //实现点击分类跳转
  //       //onClick={() => this.setState({ currentDisplayCatogory: _id })}
  //       icon={
  //         <div
  //           style={{
  //             width: '22px',
  //             height: '22px',
  //             background: 'green',
  //           }}
  //         />
  //       }
  //       selectedIcon={
  //         <div
  //           style={{
  //             width: '22px',
  //             height: '22px',
  //             background: 'blue',
  //           }}
  //         />
  //       }
  //       selected={this.state.selectedTab === this.state.colorlist[_id]}
  //       //badge={1}
  //       onPress={() => {
  //         this.setState({
  //           selectedTab: this.state.colorlist[_id],
  //         })
  //       }}
  //       data-seed="logId"
  //     >
  //       {this.renderContent(_id)}
  //     </TabBar.Item>
  //   ))
  // }

  //index by name, not id,may change later
  renderContent = displayIndex => {
    console.log('paole ' + displayIndex)

    return (
      <div>
        <div>
          {this.state.menus.map(
            ({ title, description, image_id, category, cost, index }) => {
              return (
                category.name === displayIndex && (
                  <DishItemCard
                    title={title}
                    description={description}
                    cost={cost}
                    image_id={image_id}
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

  renderContentTab = tab => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        backgroundColor: '#fff',
      }}
    >
      {this.renderContent(tab.title)}
    </div>
  )

  render() {
    var l = this.getCategories()
    var tabs = []
    for (var i = 0; i < l.length; i++) {
      var tmp = { title: l[i] }

      tabs.push(tmp)
    }

    const sidebar = (
      <List>
        {this.state.orderlist.map((item, index) => {
          return (
            <List.Item
              key={index}
              extra={
                <Button
                  onClick={() => this.handleDeleteBtn(index, item)}
                  type="ghost"
                  size="small"
                >
                  delete
                </Button>
              }
              //thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
            >
              {item} {this.state.dic_order.get(item)}
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
          <div>
            <WhiteSpace />
            <Tabs
              tabs={tabs}
              renderTabBar={props => <Tabs.DefaultTabBar {...props} page={3} />}
            >
              {this.renderContentTab}
            </Tabs>
            <WhiteSpace />
          </div>

          {/* <TabBar
            unselectedTintColor="#949494"
            tintColor="#33A3F4"
            barTintColor="white"
            hidden={this.state.hidden}
            tabBarPosition="top"
          >
            {this.renderCategoryItems(this.getUniqueCategories())}
          </TabBar> */}
        </Drawer>
      </div>
    )
  }
}

export default Customer
