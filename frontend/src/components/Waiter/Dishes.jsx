import React from 'react'
import { Popconfirm, message, Tooltip, Collapse } from 'antd'
import QueueAnim from 'rc-queue-anim'

const { Panel } = Collapse

const PLACED = 'PLACED'
const READY = 'READY'
const SERVED = 'SERVED'
const FAILED = 'FAILED'
const SERVING = 'SERVING'

export const groupBy = (array, key) => {
  // Return the end result
  return array.reduce((result, currentValue) => {
    // If an array already present for key, push it to the array. Else create an array and push the object
    let tmp = result.get(currentValue[key]) || []
    tmp.push({ ...currentValue, key: currentValue._id })
    result.set(currentValue[key], tmp)
    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result
  }, new Map()) // empty object is the initial value for result object
}

class Dishes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      finished: [],
      failed: [],
    }
  }

  handleClick = (dish, action, e) => {
    if (this.props.socket === null || this.props.socket.disconnected) {
      message.error('Not connect to server!')
      return
    }

    let targetDish = dish

    switch (action) {
      case 'serving':
        targetDish.status = SERVING
        targetDish.servedBy = this.props.user

        // send finished dish to server
        try {
          this.props.socket.emit('update dish', targetDish)
        } catch (error) {
          console.log(error)
        }
        break

      case 'finish':
        targetDish.status = SERVED
        targetDish.serveTime = new Date()

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

      case 'failed':
        targetDish.status = FAILED
        targetDish.servedBy = this.props.user
        targetDish.serveTime = new Date()

        // send failed dish to server
        try {
          this.props.socket.emit('update dish', targetDish)
          this.setState({
            failed: [...this.state.failed, targetDish],
          })

          message.success('Dish removed.')
        } catch (error) {
          console.log(error)
        }
        break

      case 'reset':
        targetDish.status = READY
        targetDish.serveTime = null

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

      case 'not-see':
        targetDish.status = PLACED

        // send reset to server
        try {
          this.props.socket.emit('update dish', targetDish)
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
      <div className="half">
        <div className="title">
          <h2>Dishes</h2>
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
  confirmFail(dish, e) {
    this.props.handleClick(dish, 'failed', e)
  }

  confirmNotSee(dish, e) {
    this.props.handleClick(dish, 'not-see', e)
  }

  renderSingleDish(dish) {
    const renderedDish = (
      <div className="dishBox" key={dish._id}>
        <div className="dishName">{dish.name}</div>
        <div>{new Date(dish.readyTime).toLocaleTimeString()}</div>
        <div className="buttonBox">
          {dish.status === SERVING && <div>Serving...</div>}
          {dish.status === READY && (
            <Tooltip title="serving">
              <button
                className="finish"
                onClick={e => this.props.handleClick(dish, 'serving', e)}
              >
                <i className="fas fa-running"></i>
              </button>
            </Tooltip>
          )}

          {dish.status === SERVING &&
            this.props.user._id === dish.servedBy._id && (
              <Tooltip title="finish">
                <button
                  className="finish"
                  onClick={e => this.props.handleClick(dish, 'finish', e)}
                >
                  <i className="fas fa-check"></i>
                </button>
              </Tooltip>
            )}

          {dish.status === SERVING && (
            <Popconfirm
              title="Failed to serve?"
              onConfirm={e => this.confirmFail(dish, e)}
              okText="Yes"
              cancelText="No"
            >
              <button className="fail">
                <i className="fas fa-times"></i>
              </button>
            </Popconfirm>
          )}

          {dish.status === READY && (
            <Popconfirm
              title="Cannot see the dish?"
              onConfirm={e => this.confirmNotSee(dish, e)}
              okText="Yes"
              cancelText="No"
            >
              <button className="fail">
                <i className="fas fa-question"></i>
              </button>
            </Popconfirm>
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
          <QueueAnim type="left">{dishes}</QueueAnim>
        </div>
      )
      result.push(tableBox)
    }
    return <QueueAnim type="left">{result}</QueueAnim>
  }
}

class RenderFinished extends React.Component {
  renderSingleDish(dish) {
    return (
      <div className="dishBox" key={dish._id}>
        <div className="dishName">{dish.name}</div>
        <div>{new Date(dish.serveTime).toLocaleTimeString()}</div>
        <div className="buttonBox">
          <Tooltip title="reset">
            <button
              className="reset"
              onClick={e => this.props.handleClick(dish, 'reset', e)}
            >
              <i className="fas fa-undo-alt"></i>
            </button>
          </Tooltip>
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
          <QueueAnim type="left">{dishes}</QueueAnim>
        </div>
      )
      result.push(tableBox)
    }
    return <QueueAnim type="left">{result}</QueueAnim>
  }
}

export default Dishes
