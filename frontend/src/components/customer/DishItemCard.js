import React, { Component, Fragment } from 'react'
import { getMenus } from './services/fakemenu'

import {
  Card,
  WingBlank,
  WhiteSpace,
  Button,
  Icon,
  Pagination,
} from 'antd-mobile'
import 'antd-mobile/dist/antd-mobile.css'

//to make pictures display correctly. must pay attention to the order of img in file
const requireContext = require.context('./', true, /\.jpg$/)
const Imgs = requireContext.keys().map(requireContext)

console.log('Imgs->' + Imgs)

class DishItemCard extends Component {
  state = {
    menus: getMenus(),
    count: 1,
    //dish_id: 0,
  }

  handleAdd() {
    console.log('add')
    this.setState({
      count: this.state.count + 1,
    })
  }

  handleMinus() {
    console.log('minus')
    if (this.state.count > 1) {
      this.setState({
        count: this.state.count - 1,
      })
    }
  }

  render() {
    const { title, image_id, description, cost, getorder } = this.props

    var imgURL = Imgs[image_id]
    console.log('imgurl' + imgURL)
    return (
      <WingBlank size="sm">
        <WhiteSpace size="sm" />
        <Card>
          <Card.Header title={title} />
          <Card.Body>
            <img src={imgURL} alt="wrong" width="200px" height="100px" />
          </Card.Body>
          <Card.Footer
            content={description}
            extra={
              // <div>
              <Fragment>
                <i
                  style={{
                    fontSize: '20px',
                  }}
                >
                  {cost}$
                </i>
                <span>
                  <div className="ui icon" onClick={() => this.handleAdd()}>
                    <i className="plus square blue icon" />
                  </div>

                  <input
                    style={{
                      width: '20px',
                    }}
                    value={this.state.count}
                  />

                  <div className="ui icon" onClick={() => this.handleMinus()}>
                    <i className="minus square blue icon" />
                  </div>
                </span>

                <Button
                  type="ghost"
                  size="small"
                  onClick={() => getorder(this.props.title, this.state.count)}
                >
                  add to cart
                </Button>
              </Fragment>
            }
          />
        </Card>

        <WhiteSpace size="sm" />
      </WingBlank>
    )
  }
}

export default DishItemCard
