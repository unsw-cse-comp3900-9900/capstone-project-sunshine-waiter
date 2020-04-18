import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import { Button, Icon, WingBlank, WhiteSpace } from 'antd-mobile'
import 'antd-mobile/dist/antd-mobile.css'

class PaymentFinsh extends Component {
  state = {}
  render() {
    const { handleOrderStatus, orderId, id } = this.props
    console.log('thisid->', id, orderId)
    return (
      <div style={{ height: '800px' }}>
        <div
          style={{
            position: 'absolute',
            top: '30%',
            fontSize: '40px',
            fontFamily: 'Times New Roman',
          }}
        >
          Congratulations! You have finished payment successfully..
          <WhiteSpace size="lg" />
          <i
            class="fas fa-check-circle"
            style={{
              position: 'absolute',
              left: '40%',
            }}
          ></i>
        </div>
        <Link to={'/restaurants/' + id + '/customer/' + orderId}>
          <Button
            type="ghost"
            //size="large"
            style={{
              width: '200px',
              position: 'absolute',
              left: '20%',
              bottom: '30%',
            }}
            // onClick={() => handleOrderStatus()}
          >
            check my order
          </Button>
        </Link>
      </div>
    )
  }
}

export default PaymentFinsh
