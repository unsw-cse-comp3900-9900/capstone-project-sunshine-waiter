import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import { WhiteSpace } from 'antd-mobile'
import 'antd-mobile/dist/antd-mobile.css'

import { Button } from 'antd'
import 'antd/dist/antd.css'

class PaymentFinsh extends Component {
  state = {}

  render() {
    const { orderId, id } = this.props
    console.log('thisid->', id, orderId)
    return (
      <div style={{ height: '100%' }}>
        <div
          style={{
            marginTop: '30%',

            fontSize: '40px',
            fontFamily: 'bold',
            textAlign: 'center',
            marginBottom: '10%',
          }}
        >
          Congratulations! You have finished payment successfully..
          <WhiteSpace size="lg" />
          <div
            style={{
              textAlign: 'center',
            }}
          >
            <i class="fas fa-check-circle" />
          </div>
        </div>
        <Link to={'/restaurants/' + id + '/customer/' + orderId}>
          <div
            style={{
              textAlign: 'center',
            }}
          >
            <Button
              type="ghost"
              size="large"
              style={{
                width: '70%',
                height: '20%',

                marginTop: '15%',
                color: 'dodgerblue',
              }}
              // onClick={() => handleOrderStatus()}
            >
              check my order
            </Button>
          </div>
        </Link>
      </div>
    )
  }
}

export default PaymentFinsh
