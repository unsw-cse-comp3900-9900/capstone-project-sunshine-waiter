import React, { Component } from 'react'
import { Table, Typography, Input } from 'antd'
import 'antd/dist/antd.css'

import { WingBlank } from 'antd-mobile'
import 'antd-mobile/dist/antd-mobile.css'

import { Button } from 'antd'
import 'antd/dist/antd.css'

const { Column } = Table
const { Text } = Typography
const { TextArea } = Input

class NavigationOrderConfirm extends Component {
  state = {}
  renderFooter = () => {
    const { handleCancelPay } = this.props
    return (
      <div
        style={{
          marginBottom: '30%',
        }}
      >
        <TextArea rows={4} placeholder="Notes:"></TextArea>
        <Button
          type="ghost"
          size="small"
          inline
          style={{
            position: 'absolute',
            left: '20px',
            bottom: '10px',
          }}
          onClick={() => handleCancelPay()}
        >
          cancel
        </Button>
        <Button
          type="ghost"
          inline
          style={{
            position: 'absolute',
            right: '20px',
            bottom: '10px',
          }}
          onClick={() => this.props.handleConfirmPay()}
        >
          confirm
        </Button>
      </div>
    )
  }

  render() {
    const { totalPrice, orderItemsData } = this.props
    return (
      <div>
        <header>
          <h1 id="header-message">Payment Confirmation</h1>
        </header>
        <WingBlank size="md">
          <Table
            style={{
              minHeight: '100hv',
            }}
            dataSource={orderItemsData}
            footer={() => this.renderFooter()}
            bordered
            pagination={false}
            summary={() => {
              return (
                <tr>
                  <th>Total</th>
                  <td colSpan={2}>
                    <Text strong>{totalPrice}</Text>
                  </td>
                </tr>
              )
            }}
          >
            <Column title="Name" dataIndex="name" key="name" />
            <Column title="Amount" dataIndex="amount" key="amount" />
            <Column title="Price" dataIndex="price" key="price" />
          </Table>
        </WingBlank>
      </div>
    )
  }
}

export default NavigationOrderConfirm
