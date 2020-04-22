import React, { Component } from 'react'
import DishItemCard from './DishItemCard.js'

import NavigationOrderConfirm from './NavigationOrderConfirm.js'
import PaymentFinsh from './PaymentFinsh.js'

import { getMenus } from './services/fakemenu'
import './my-drawer.css'

import {
  List,
  Drawer,
  Icon,
  NavBar,
  Tabs,
  WhiteSpace,
  InputItem,
  Modal,
  Toast,
} from 'antd-mobile'
import 'antd-mobile/dist/antd-mobile.css'
//import 'antd/dist/antd.css'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { fetchPublicMenuApi } from '../apis/actions/menus'
import { createOrder } from '../apis/actions/order'
import { getCookie } from '../authenticate/Cookies'
import { getSingleRestaurant } from '../apis/actions/restaurants'

import _ from 'lodash'
//import { createForm } from 'rc-form'
import { BrowserRouter as Router, Link, useLocation } from 'react-router-dom'

import { Table, Typography, Button } from 'antd'
import 'antd/dist/antd.css'

const { Column, ColumnGroup } = Table
const { Text } = Typography

class Customer extends Component {
  state = {
    selectedTab: '1',
    hidden: false,
    fullScreen: false,
    //menus: getMenus(),

    //open: true
    docked: false,
    orderlist: [], // put the order

    dic_order: new Map(), //store dishes,count
    currentMenu: {},
    placeBy: 0,
    orderItemsData: [],
    orderitem: {},
    tableid: '',
    value: '',

    pagestatus: 0, // control page jump
    totalPrice: 0,
    orderstatus: false,
    orderId: '',
    restaurantName: '',
  }

  componentDidMount = () => {
    this.onFetchCurrentMenu()
    this.onFetchTableId()
    this.setRestaurant()
  }

  onSetCurrentMenu = (data) => {
    console.log('onsetcuren', data)
    this.setState({
      currentMenu: data,
    })
  }

  onFetchTableId = () => {
    var paramsString = this.props.location.search
    var searchParams = new URLSearchParams(paramsString)
    console.log('tableid->>', searchParams.get('tableid'))
    this.setState({
      placedBy: searchParams.get('tableid'),
    })

    const tableid = searchParams.get('tableid')
    this.FetchTableIdAlert(tableid)
  }

  FetchTableIdAlert = (tableid) => {
    Modal.alert('Your table number is', tableid, [
      { text: 'OK', onPress: () => console.log('ok') },
    ])
  }

  onFetchCurrentMenu = async () => {
    const { id } = this.props.match.params
    await fetchPublicMenuApi(id, this.onSetCurrentMenu)
  }

  setRestaurant = async () => {
    const { id } = this.props.match.params

    await getSingleRestaurant(getCookie('token'), id, this.onSetName)
  }

  onSetName = (data) => {
    this.setState({
      restaurantName: data.name,
    })
  }

  onSubmit = () => {
    if (this.state.orderItemsData.length === 0) {
      Toast.fail('You have not choose a dish, please double check', 1)
      return
    }

    this.computeTotalPrice()
    Toast.loading('loading...', 1)

    setTimeout(() => this.handleflag(), 1000)
  }

  handleflag() {
    this.setState({
      pagestatus: 1,
    })
  }

  computeTotalPrice() {
    var total = 0
    for (var i = 0; i < this.state.orderItemsData.length; i++) {
      total =
        total +
        this.state.orderItemsData[i].price * this.state.orderItemsData[i].amount
    }

    total = total.toFixed(2)

    this.setState({
      totalPrice: total,
    })
  }

  onDock = (d) => {
    this.setState({
      [d]: !this.state[d],
    })
  }

  onOpenChange = (...args) => {
    console.log(args)
    this.setState({ open: !this.state.open })
  }

  increaseorder = (name, id, price, num, categoryArray) => {
    if (this.state.orderItemsData != []) {
      for (var i = 0; i < this.state.orderItemsData.length; i++) {
        if (this.state.orderItemsData[i].name === name) {
          const originamount = this.state.orderItemsData[i].amount
          this.state.orderItemsData[i].amount = originamount + num

          if (this.state.dic_order.has(name)) {
            this.state.dic_order.set(name, this.state.dic_order.get(name) + num)
          } else {
            this.state.dic_order.set(name, num)
          }

          this.setState({
            orderlist: [...this.state.dic_order.keys()],
            orderItemsData: [...this.state.orderItemsData],
            orderitem: [],
          })
          return
        }
      }
    }

    if (this.state.dic_order.has(name)) {
      this.state.dic_order.set(name, this.state.dic_order.get(name) + num)
      this.state.orderitem = {
        categoryArray: categoryArray,
        menuItem: id,
        price: price,
        notes: 'to do',
        name: name,
        amount: this.state.dic_order.get(name) + num,
      }
    } else {
      this.state.dic_order.set(name, num)
      this.state.orderitem = {
        categoryArray: categoryArray,
        menuItem: id,
        price: price,
        notes: 'to do',
        name: name,
        amount: num,
      }
    }

    console.log('orderitem,', this.state.orderitem)

    this.setState({
      orderlist: [...this.state.dic_order.keys()],
      orderItemsData: [...this.state.orderItemsData, this.state.orderitem],
      orderitem: [],
    })
  }

  handleDeleteBtn(index, item) {
    console.log('delete' + index)
    const orderlist = [...this.state.orderlist]
    const orderItemsData = [...this.state.orderItemsData]
    orderlist.splice(index, 1)
    this.state.dic_order.delete(item)
    for (var i = 0; i < this.state.orderItemsData.length; i++) {
      if (this.state.orderItemsData[i].name === item) {
        orderItemsData.splice(i, 1)
        break
      }
    }

    this.setState({
      orderlist: [...orderlist],
      dic_order: this.state.dic_order,
      orderItemsData: [...orderItemsData],
    })
  }

  handleAdd(index, item) {
    const num = this.state.dic_order.get(item)
    this.state.dic_order.set(item, num + 1)
    const orderItemsData = [...this.state.orderItemsData]
    for (var i = 0; i < this.state.orderItemsData.length; i++) {
      if (this.state.orderItemsData[i].name === item) {
        orderItemsData[i].amount = num + 1
      }
    }
    this.setState({
      dic_order: this.state.dic_order,
      orderItemsData: [...orderItemsData],
    })
  }

  handleMinus(index, item) {
    const num = this.state.dic_order.get(item)
    this.state.dic_order.set(item, num - 1)

    if (this.state.dic_order.get(item) == 0) {
      console.log('deletesuccess')
      this.handleDeleteBtn(index, item)
      console.log('orderlist', this.state.orderlist)
    } else {
      const orderItemsData = [...this.state.orderItemsData]
      for (var i = 0; i < this.state.orderItemsData.length; i++) {
        if (this.state.orderItemsData[i].name === item) {
          orderItemsData[i].amount = num - 1
        }
      }
      this.setState({
        dic_order: this.state.dic_order,
        orderItemsData: [...orderItemsData],
      })
    }
  }

  handleCancelPay = () => {
    this.setState({
      pagestatus: 0,
    })
  }

  handleConfirmPay = () => {
    Modal.alert('You will pay the bill?', '', [
      { text: 'Cancel', onPress: () => console.log('cancel') },
      { text: 'Ok', onPress: () => this.handleConfirmPayOk() },
    ])
  }

  handleConfirmPayOk = async () => {
    // prepare request data
    const { id } = this.props.match.params
    const param = {
      placedBy: this.state.placedBy,
      orderItemsData: this.state.orderItemsData,
    }

    await createOrder(id, param, (data) => {
      console.log('Order created. Here is the order:  ', data)
      this.setState({
        orderId: data._id,
        pagestatus: 2,
      })
    })
  }

  getCategories = () => {
    const categoryList = new Map()

    if (this.state.currentMenu.categories !== undefined) {
      this.state.currentMenu.categories.map(({ _id, name }) => {
        if (!categoryList.has(_id)) {
          categoryList.set(name, _id)
        }
      })
    }

    return categoryList
  }

  //index by name, not id,may change later
  renderContent = (displayIndex) => {
    return (
      <div>
        <div>
          {this.state.currentMenu.menuItems.map(
            ({
              categoryArray,
              _id,
              name,
              price,
              description,
              note,
              restaurant,
              img,
            }) => {
              return (
                categoryArray[0] === displayIndex && (
                  <DishItemCard
                    categoryArray={categoryArray}
                    name={name}
                    description={description}
                    price={price}
                    key={_id}
                    _id={_id}
                    restaurantId={restaurant}
                    menuItemId={_id}
                    img={img}
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

  renderContentTab = (tab) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        backgroundColor: '#fff',
      }}
    >
      {this.renderContent(tab.id)}
    </div>
  )

  render() {
    console.log('this is restaurant name->', this.state.orderItemsData)
    if (this.state.pagestatus === 0) {
      // console.log('currentmenu', this.state.currentMenu)
      // console.log('_id', this.state.currentMenu._id)
      // console.log('category', this.state.currentMenu.categories)

      // console.log('idvalue->', this.state.value)

      // console.log('placedby->', this.state.placedBy)
      // if (this.state.currentMenu.categories !== undefined) {
      //   console.log('category', this.state.currentMenu.categories[0].name)
      // }

      if (this.getCategories() !== null) {
        var l = [...this.getCategories().keys()]
        var tabs = []

        for (var i = 0; i < l.length; i++) {
          var tmp = { title: l[i], id: this.getCategories().get(l[i]) }

          tabs.push(tmp)
        }
      }

      const sidebar = (
        <List>
          {this.state.orderlist.map((item, index) => {
            return (
              <List.Item
                key={index}
                extra={
                  <span>
                    <i
                      className="ui icon"
                      onClick={() => this.handleAdd(index, item)}
                    >
                      <i className="plus square blue icon" />
                    </i>

                    <input
                      style={{
                        width: '20px',
                      }}
                      value={this.state.dic_order.get(item)}
                    />

                    <i
                      className="ui icon"
                      onClick={() => this.handleMinus(index, item)}
                    >
                      <i className="minus square blue icon" />
                    </i>
                  </span>
                }
              >
                {item}
              </List.Item>
            )
          })}
          <Button
            onClick={() =>
              Modal.alert(
                'You will make a order',
                'Going to the payment page...',
                [
                  { text: 'Cancel', onPress: () => console.log('cancel') },
                  {
                    text: 'Ok',
                    onPress: () => setTimeout(this.onSubmit(), 3000),
                  },
                ]
              )
            }
            type="primary"
            style={{
              width: '100%',
            }}

            //activeStyle={{ backgroundColor: 'white' }}
          >
            submit the order
          </Button>
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
            //onRightClick={() => this.handleRequest()}
            leftContent={
              <div className="icons-list">
                <ShoppingCartOutlined />
              </div>
            }
          >
            {this.state.restaurantName}
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
            <div
              style={{
                position: 'relative',
                top: '-40px',
              }}
            >
              <Tabs
                tabs={tabs}
                renderTabBar={(props) => (
                  <Tabs.DefaultTabBar {...props} page={3} />
                )}
              >
                {this.renderContentTab}
              </Tabs>
              <WhiteSpace />
            </div>
          </Drawer>
        </div>
      )
    } else if (this.state.pagestatus === 1) {
      return (
        <NavigationOrderConfirm
          flag={this.state.flag}
          totalPrice={this.state.totalPrice}
          orderItemsData={this.state.orderItemsData}
          handleCancelPay={this.handleCancelPay}
          handleConfirmPay={this.handleConfirmPay}
        />
      )
    } else if (this.state.pagestatus === 2) {
      return (
        <PaymentFinsh
          id={this.props.match.params.id}
          orderId={this.state.orderId}
        />
      )
    }
  }
}

export default Customer
