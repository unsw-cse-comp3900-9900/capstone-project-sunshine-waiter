import React, { Component } from 'react'

import { fetchOrderApi } from '../apis/actions/order'

import { getCookie } from '../authenticate/Cookies'
import { Button, Icon, WingBlank, WhiteSpace, Modal, Toast } from 'antd-mobile'
import 'antd-mobile/dist/antd-mobile.css'

import { Table, Typography, Input } from 'antd'
import 'antd/dist/antd.css'
import { sendRequest } from '../apis/actions/request'
import './Customer.css'

const { Column } = Table
const { Text } = Typography

class OrderCheckout extends Component {
  state = {
    currentOrder: {},
    orderItemsData: [],
    totoalprice: 0,
    orderNum: '',
    tableid: '',
  }

  componentDidMount = () => {
    this.onFetchCurrentOrder()
  }

  OnSetCurrentOrder = data => {
    console.log('currentorder->', data)
    this.setState({
      currentOrder: data,
      orderItemsData: data.items,
      orderNum: data.intradayId,
      tableid: data.placedBy,
    })
    this.computeTotalPrice()
  }

  onFetchCurrentOrder = async () => {
    const { orderId } = this.props.match.params
    const { id } = this.props.match.params
    await fetchOrderApi(getCookie('token'), id, orderId, this.OnSetCurrentOrder)
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

  handleRequestConfirm = async () => {
    Toast.success('Your request has been sent, congratulations!', 1)
    const { id } = this.props.match.params
    const { orderId } = this.props.match.params

    const param = {
      restaurant: id,
      tableId: this.state.tableid,
      order: orderId,
    }

    await sendRequest(getCookie('token'), id, param)
  }

  handlerequest = async () => {
    Modal.alert('You will ask a request', '...', [
      { text: 'Cancel', onPress: () => console.log('cancel') },
      {
        text: 'Ok',
        onPress: () => this.handleRequestConfirm(),
      },
    ])
  }

  render() {
    console.log('ordercheckouid->', this.props)

    const { orderId } = this.props.match.params
    return (
      <div>
        <header>
          <h1 id="header-message">Your order # is : {this.state.orderNum}</h1>
        </header>
        <div className="table-container">
          <Table
            dataSource={this.state.orderItemsData}
            pagination={false}
            summary={() => {
              return (
                <tr>
                  <th>Total</th>
                  <td colSpan={2}>
                    <Text strong>{this.state.totalPrice}</Text>
                  </td>
                </tr>
              )
            }}
          >
            <Column title="Name" dataIndex="name" key="name" />
            <Column title="Amount" dataIndex="amount" key="amount" />
            <Column title="Price" dataIndex="price" key="price" />
          </Table>
          <footer>
            <Button onClick={() => this.handlerequest()}>
              Request Assistance
              <i class="fas fa-bell" />
            </Button>
          </footer>
        </div>
      </div>
    )
  }
}

export default OrderCheckout
