import React, { Component } from 'react'
import { Table, Typography, Input } from 'antd'
import 'antd/dist/antd.css'

import { Button, Icon, WingBlank, WhiteSpace } from 'antd-mobile'
import 'antd-mobile/dist/antd-mobile.css'

import { Link } from 'react-router-dom'
import styles from './page1.less'

const { Column } = Table
const { Text } = Typography
const { TextArea } = Input

class NavigationOrderConfirm extends Component {
  state = {}
  renderFooter = () => {
    const { handleCancelPay, flag } = this.props
    return (
      <div
        style={{
          marginBottom: '50%',
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
          size="small"
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

  renderHeader = () => {
    return (
      <div
        style={{
          fontSize: '20px',
          fontFamily: 'times',
          position: 'relative',
          left: '10%',
          right: '10%',
        }}
      >
        Payment Confirmation
      </div>
    )
  }

  render() {
    const { totalPrice, orderItemsData } = this.props
    return (
      <div
        style={{
          height: '800px',
        }}
      >
        <WingBlank size="md">
          <Table
            style={{
              minHeight: '100hv',
            }}
            dataSource={orderItemsData}
            footer={() => this.renderFooter()}
            title={() => this.renderHeader()}
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
