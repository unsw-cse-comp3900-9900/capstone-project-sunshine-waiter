import React, { Component, Fragment } from 'react'
import { getMenus } from './services/fakemenu'

import { Card, WingBlank, WhiteSpace } from 'antd-mobile'
import 'antd-mobile/dist/antd-mobile.css'

import { Table, Typography, Button } from 'antd'
import 'antd/dist/antd.css'

//to make pictures display correctly. must pay attention to the order of img in file
const requireContext = require.context('./', true, /\.jpg$/)
const Imgs = requireContext.keys().map(requireContext)

const baseURL = 'http://localhost:8000'

console.log('Imgs->' + Imgs)

class DishItemCard extends Component {
  state = {
    // menus: getMenus(),
    count: 1,
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

  handleClick() {
    this.props.getorder(
      this.props.name,
      this.props._id,
      this.props.price,
      this.state.count,
      this.props.categoryArray
    )
    this.setState({
      count: 1,
    })
  }

  render() {
    // const { title, image_id, description, cost, getorder } = this.props
    const {
      categoryArray,
      name,
      price,
      description,
      restaurantId,
      menuItemId,
      img,
    } = this.props

    // var imgURL = Imgs[image_id]
    // console.log('imgurl' + imgURL)

    const imgURL =
      baseURL +
      '/restaurants/' +
      restaurantId +
      '/menuItems/' +
      menuItemId +
      '/img'
    return (
      <WingBlank size="sm">
        <WhiteSpace size="sm" />
        <Card
          style={{
            width: '100%',
          }}
        >
          <Card.Header title={name} />
          <Card.Body>
            <img
              src={img ? imgURL : require('./SWLogo.png')}
              alt="wrong"
              width="60%"
              height="20%"
            />
            {/* <img
              src={require('./services/statics/0_Roseberry.jpg')}
              alt="wrong"
              width="200px"
              height="100px"
            /> */}
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
                  {price}$
                </i>
                <span>
                  <i className="ui icon" onClick={() => this.handleAdd()}>
                    <i className="plus square blue icon" />
                  </i>

                  <input
                    style={{
                      width: '20px',
                    }}
                    value={this.state.count}
                  />

                  <i className="ui icon" onClick={() => this.handleMinus()}>
                    <i className="minus square blue icon" />
                  </i>
                </span>

                <Button
                  size="default"
                  style={{
                    color: 'dodgerblue',
                  }}
                  onClick={() => this.handleClick()}
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
