import React, { Component } from 'react'
import SalesChart from './salesChart'
import PopularItems from './popularItems'
import CategoryPie from './categoryPie'
import TimeSelector from './timeSelector'
import { getCookie } from '../../authenticate/Cookies'
import getAllOrderItems from '../../apis/actions/orderItems'
import { groupBy } from '../../Waiter/Dishes'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderItems: {},
      data: [], //
      selectedDomain: {},
    }
  }

  getOrderItems = async () => {
    const { id } = this.props.match.params
    const orderItems = await getAllOrderItems(
      getCookie('token'),
      id,
      this.getOrderItems
    )
    this.setState({ orderItems: orderItems })
  }

  initData = () => {
    const data = this.state.orderItems.map(item => {
      return { x: new Date(item.serveTime).toLocaleDateString(), y: item.price }
    })
    const groupByDate = groupBy(data, 'x')
    let dailyIncomes = []
    for (let [date, prices] of groupByDate) {
      let income = prices.map(_ => _.y).reduce((a, b) => a + b, 0)
      let [d, m, y] = date.split('/').map(_ => parseInt(_))
      dailyIncomes.push({ x: new Date(y, m, d), y: income })
    }

    this.setState({ data: dailyIncomes })
  }

  async componentDidMount() {
    await this.getOrderItems() // fetch all orderItems
    this.initData()
  }

  handleZoom = domain => {
    this.setState({ brushDomain: domain })
  }

  handleBrush = domain => {
    this.setState({ zoomDomain: domain })
  }

  render() {
    const { data, brushDomain, zoomDomain } = this.state

    return (
      <React.Fragment>
        <TimeSelector
          data={data}
          brushDomain={brushDomain}
          handleBrush={this.handleBrush}
        />
        <SalesChart
          data={data}
          zoomDomain={zoomDomain}
          handleZoom={this.handleZoom}
        />
        <PopularItems />
        <CategoryPie />
      </React.Fragment>
    )
  }
}

export default Dashboard
