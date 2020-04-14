import React, { Component } from 'react'
import SalesChart from './salesChart'
import PopularItems from './popularItems'
import CategoryPie from './categoryPie'
import TimeSelector from './timeSelector'
import { getCookie } from '../../authenticate/Cookies'
import getAllOrderItems from '../../apis/actions/orderItems'
import { groupBy } from '../../Waiter/Dishes'
import './dashBoard.css'
import TotalSale from './totalSale'
import OrderAmount from './orderAmount'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderItems: [],
      data: [], //
      zoomDomain: {},
    }
  }

  selectedOrderItems = () => {
    const [start, end] = this.state.zoomDomain.x || [new Date(0), new Date()]
    // console.log(start, end)
    const selected = this.state.orderItems.filter(item => {
      return (
        start <= new Date(item.serveTime) && new Date(item.serveTime) <= end
      )
    })

    return selected
  }

  getOrderItems = async () => {
    const { id } = this.props.match.params
    const orderItems = await getAllOrderItems(
      getCookie('token'),
      id,
      this.getOrderItems
    )
    const sorted = orderItems.sort(
      (a, b) => new Date(a.serveTime) - new Date(b.serveTime)
    )
    const start = new Date(sorted[0].serveTime)
    const end = new Date(sorted[sorted.length - 1].serveTime)
    const zoomDomain = { x: [start, end] }
    this.setState({ orderItems: sorted, zoomDomain })
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
    this.setState({ zoomDomain: domain })
  }

  handleBrush = domain => {
    this.setState({ zoomDomain: domain })
  }

  render() {
    const { data, zoomDomain } = this.state
    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <div className="col-sm chartCard">
              <TimeSelector
                data={data}
                brushDomain={zoomDomain}
                handleBrush={this.handleBrush}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm chartCard">
              <TotalSale data={data} zoomDomain={zoomDomain} />
            </div>
            <div className="col-sm chartCard">
              <OrderAmount data={this.selectedOrderItems()} />
            </div>
          </div>
          <div className="row">
            <div className="col-sm chartCard ">
              <SalesChart
                data={data}
                zoomDomain={zoomDomain}
                handleZoom={this.handleZoom}
              />
            </div>
            <div className="col-sm chartCard">
              <PopularItems data={this.selectedOrderItems()} />
            </div>
          </div>
        </div>

        <CategoryPie />
      </React.Fragment>
    )
  }
}

export default Dashboard
