import React from 'react'
import { groupBy } from '../../Waiter/Dishes'

const OrderAmount = ({ data }) => {
  let orderAmount = 0
  if (data) {
    const groupByOrder = groupBy(data, 'order')
    orderAmount = groupByOrder.size
    console.log(orderAmount)
  }
  return (
    <React.Fragment>
      <span>Order Amount</span>
      <h1>{orderAmount}</h1>
    </React.Fragment>
  )
}

export default OrderAmount
