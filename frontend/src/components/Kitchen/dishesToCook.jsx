import React from 'react'
import { Popconfirm, message, Tooltip, Collapse } from 'antd'
import QueueAnim from 'rc-queue-anim'
import { groupBy } from '../Waiter/Dishes'

const { Panel } = Collapse

const PLACED = 'PLACED'
const COOKING = 'COOKING'
const READY = 'READY'

class DishesToCook extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      finished: [],
    }
  }

  handleClick = (dish, action, e) => {
    if (this.props.socket === null || this.props.socket.disconnected) {
      message.error('Not connect to server!')
      return
    }
    let targetDish = dish

    switch (action) {
      case 'cooking':
        targetDish.status = COOKING
        targetDish.cookedBy = this.props.user

        // send finished dish to server
        try {
          this.props.socket.emit('update dish', targetDish)
        } catch (error) {
          console.log(error)
        }
        break

      case 'finish':
        targetDish.status = READY
        targetDish.readyTime = new Date()

        // send finished dish to server
        try {
          this.props.socket.emit('update dish', targetDish)
          this.setState({
            finished: [...this.state.finished, targetDish],
          })
        } catch (error) {
          console.log(error)
        }

        break

      case 'reset':
        targetDish.status = PLACED
        targetDish.readyTime = null

        // send reset to server
        try {
          this.props.socket.emit('update dish', targetDish)
          this.setState({
            finished: [...this.state.finished].filter(
              dish => dish._id !== targetDish._id
            ),
          })
        } catch (error) {
          console.log(error)
        }
        break

      default:
        return
    }
  }

  render() {
    return (
      <div id="kitchen">
        <div className="title">
          <h2>Dishes to cook</h2>
        </div>

        <div className="box">
          <RenderDishes
            dishList={this.props.dishQue}
            handleClick={this.handleClick}
            user={this.props.user}
          />

          {Object.keys(this.state.finished).length > 0 && (
            <Collapse
              bordered={false}
              defaultActiveKey={['1']}
              className="finishPanel"
            >
              <Panel key={1} header={<h2>Finished</h2>}>
                <RenderFinished
                  dishList={this.state.finished}
                  handleClick={this.handleClick}
                />
              </Panel>
            </Collapse>
          )}
        </div>
      </div>
    )
  }
}

class RenderDishes extends React.Component {
  renderSingleDish(dish) {
    const renderedDish = (
      <div className="dishBox" key={dish._id}>
        <div className="dishName">{dish.name}</div>
        <div>{dish.amount}</div>
        <div>{dish.order.createdAt}</div>
        <div className="buttonBox">
          {dish.status === COOKING && <div>Cooking...</div>}
          {dish.status === PLACED && (
            <Tooltip title="cooking">
              <button
                className="finish"
                onClick={e => this.props.handleClick(dish, 'cooking', e)}
              >
                <i className="fas fa-fire-alt"></i>
              </button>
            </Tooltip>
          )}

          {dish.status === COOKING &&
            (this.props.user._id === dish.cookedBy._id ||
              this.props.user._id === dish.cookedBy) && (
              <Tooltip title="finish">
                <button
                  className="finish"
                  onClick={e => this.props.handleClick(dish, 'finish', e)}
                >
                  <i className="fas fa-check"></i>
                </button>
              </Tooltip>
            )}
        </div>
      </div>
    )
    return renderedDish
  }

  render() {
    const dishList = this.props.dishList
    const dishListGroupedByTableId = groupBy(dishList, 'placedBy')
    let result = []
    for (let [tableId, orderItems] of dishListGroupedByTableId) {
      const dishes = orderItems.map(dish => this.renderSingleDish(dish))
      const tableBox = (
        <div className="tableBox" key={tableId}>
          <h3>Table: {tableId}</h3>
          <QueueAnim type="alpha">{dishes}</QueueAnim>
        </div>
      )
      result.push(tableBox)
    }
    return <QueueAnim type="alpha">{result}</QueueAnim>
  }
}

class RenderFinished extends React.Component {
  confirmReset(dish, e) {
    this.props.handleClick(dish, 'reset', e)
  }

  renderSingleDish(dish) {
    return (
      <div className="dishBox" key={dish._id}>
        <div className="dishName">{dish.name}</div>
        <div>{dish.amount}</div>
        <div>{new Date(dish.readyTime).toLocaleTimeString()}</div>
        <div className="buttonBox">
          <Popconfirm
            title="Reset this dish as unfinished?"
            onConfirm={e => this.confirmReset(dish, e)}
            okText="Yes"
            cancelText="No"
          >
            <button className="reset">
              <i className="fas fa-undo-alt"></i>
            </button>
          </Popconfirm>
        </div>
      </div>
    )
  }

  render() {
    const dishList = this.props.dishList
    const dishListGroupedByTableId = groupBy(dishList, 'placedBy')
    let result = []
    for (let [tableId, orderItems] of dishListGroupedByTableId) {
      const dishes = orderItems.map(dish => this.renderSingleDish(dish))
      const tableBox = (
        <div className="tableBox" key={tableId}>
          <h3>Table: {tableId}</h3>
          <QueueAnim type="alpha">{dishes}</QueueAnim>
        </div>
      )
      result.push(tableBox)
    }
    return <QueueAnim type="alpha">{result}</QueueAnim>
  }
}

export default DishesToCook
