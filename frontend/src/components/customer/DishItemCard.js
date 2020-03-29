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

class DishItemCard extends Component {
  state = {
    menus: getMenus(),
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
  render() {
    const {
      title,
      image,
      description,
      cost,
      getorder,
      num_of_dishes,
    } = this.props
    return (
      <WingBlank size="sm">
        <WhiteSpace size="sm" />
        <Card>
          <Card.Header title={title} />
          <Card.Body>
            <img
              src={require('./Roseberry.jpg')}
              alt="wrong"
              width="200px"
              height="100px"
            />
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
                  {/* <button>+</button> */}
                  <input
                    style={{
                      width: '20px',
                    }}
                    //value={this.props.num_of_dishes}
                    value={this.state.count}
                  />
                  {/* <button>-</button> */}
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
                {/* <div
                  className="ui bottom attached button"
                  onClick={() => getorder(this.props.title)}
                  // style={{
                  //   width: '10px',
                  //   height: '10px',
                  // }}
                >
                  <i className="plus circle icon"></i>
                </div> */}
                {/* <Icon type="check" /> */}
                {/* </div> */}
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
