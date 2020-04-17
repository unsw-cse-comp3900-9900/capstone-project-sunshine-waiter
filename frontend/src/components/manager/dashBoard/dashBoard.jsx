import React, { Component } from 'react'
import { Affix } from 'antd'
import SalesChart from './salesChart'
import PopularItems from './popularItems'
import CategoryPie from './categoryPie'
import TimeSelector from './timeSelector'
import { getCookie } from '../../authenticate/Cookies'
import getAllOrderItems, {
  getAllCategories,
} from '../../apis/actions/orderItems'
import { groupBy } from '../../Waiter/Dishes'
import './dashBoard.css'
import TotalSale from './totalSale'
import OrderAmount from './orderAmount'
import OrderTable from './orderTable'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderItems: [],
      categories: {},
      data: [],
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
    const orderItems = await getAllOrderItems(getCookie('token'), id)
    if (orderItems.length) {
      const sorted = orderItems.sort(
        (a, b) => new Date(a.serveTime) - new Date(b.serveTime)
      )
      const end = new Date(sorted[sorted.length - 1].serveTime)
      const start = new Date(end - 30 * 24 * 60 * 60 * 1000)
      const zoomDomain = { x: [start, end] }
      this.setState({ orderItems: sorted, zoomDomain })
    }
  }

  getCategories = async () => {
    const { id } = this.props.match.params
    const categories = await getAllCategories(getCookie('token'), id)
    let catIndex = {}
    for (let cat of categories) {
      catIndex[cat._id] = cat.name
    }
    this.setState({ categories: catIndex })
  }

  initData = () => {
    const data = this.state.orderItems.map(item => {
      return { x: new Date(item.serveTime).toDateString(), y: item.price }
    })
    const groupByDate = groupBy(data, 'x')
    let dailyIncomes = []
    for (let [date, prices] of groupByDate) {
      let income = prices.map(_ => _.y).reduce((a, b) => a + b, 0)
      dailyIncomes.push({ x: new Date(date), y: income })
    }

    this.setState({ data: dailyIncomes })
  }

  async componentDidMount() {
    await this.getOrderItems() // fetch all orderItems
    await this.getCategories()
    this.initData()
  }

  handleZoom = domain => {
    const [start, end] = domain.x
    if (end - start >= 30 * 24 * 60 * 60 * 1000) {
      this.setState({ zoomDomain: { x: [start, end] } })
    }
  }

  render() {
    const { data, zoomDomain, categories } = this.state

    const selected = this.selectedOrderItems()
    return (
      <React.Fragment>
        <div className="container">
          <Affix offsetTop={20}>
            <div className="row">
              <div className="col-sm chartCard blur">
                <TimeSelector
                  data={data}
                  zoomDomain={zoomDomain}
                  handleZoom={this.handleZoom}
                />
              </div>
            </div>
          </Affix>
          <div className="row">
            <div className="col-sm chartCard">
              <TotalSale data={data} zoomDomain={zoomDomain} />
            </div>
            <div className="col-sm chartCard">
              <OrderAmount data={selected} />
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
          </div>
          <div className="row">
            <div className="col-sm chartCard">
              <CategoryPie data={selected} categories={categories} />
            </div>
            <div className="col-sm chartCard">
              <PopularItems data={selected} />
            </div>
          </div>
          <div className="row">
            <div className="col-sm">
              <OrderTable data={selected} />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Dashboard
