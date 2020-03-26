import React from 'react'
import {
  Popconfirm,
  message,
  notification,
  Tooltip,
  Collapse,
  Spin,
} from 'antd'
import QueueAnim from 'rc-queue-anim'

const { Panel } = Collapse

const PLACED = 'PLACED'
const READY = 'READY'
const SERVED = 'SERVED'
const FAILED = 'FAILED'
const SERVING = 'SERVING'

const objToArray = obj => {
  let result = []
  for (let key in obj) {
    result.push(obj[key])
  }
  return result
}

const groupBy = (obj, key) => {
  let array = objToArray(obj)
  // Return the end result
  return array.reduce((result, currentValue) => {
    // If an array already present for key, push it to the array. Else create an array and push the object
    ;(result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    )
    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result
  }, {}) // empty object is the initial value for result object
}

class Dishes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      finished: {},
      failed: {},
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(dish, action, e) {
    let newDishQue = { ...this.props.dishQue }
    let newFinished = { ...this.state.finished }
    let newFailed = { ...this.state.failed }
    let targetDish = dish
    delete newDishQue[dish._id]
    switch (action) {
      case 'serving':
        targetDish.state = SERVING
        newDishQue[dish._id] = targetDish

        // send finished dish to server
        if (this.props.socket) {
          this.props.socket.emit('update dish', targetDish)
        } else {
          message.error('Not connect to server!')
        }
        break

      case 'finish':
        targetDish.state = SERVED
        targetDish.serveTime = new Date()
        newFinished[dish._id] = targetDish

        // send finished dish to server
        if (this.props.socket) {
          this.props.socket.emit('update dish', targetDish)
          this.setState({
            finished: newFinished,
          })

          notification['success']({
            message: dish.name + ' served!',
            description: 'Dish id: ' + dish._id,
            duration: 3,
          })
        } else {
          message.error('Not connect to server!')
        }
        break

      case 'failed':
        targetDish.state = FAILED
        targetDish.serveTime = new Date()
        newFailed[dish._id] = targetDish

        // send failed dish to server
        if (this.props.socket) {
          this.props.socket.emit('update dish', targetDish)
          this.setState({
            failed: newFailed,
          })

          message.success('Dish removed.')
        } else {
          message.error('Not connect to server!')
        }
        break

      case 'reset':
        targetDish.state = READY
        targetDish.serveTime = null
        newDishQue[dish._id] = targetDish
        delete newFinished[dish._id]

        // send reset to server
        if (this.props.socket) {
          this.props.socket.emit('update dish', targetDish)
          this.setState({
            finished: newFinished,
          })
        } else {
          message.error('Not connect to server!')
        }
        break

      case 'not-see':
        targetDish.state = PLACED
        delete newDishQue[dish._id]

        // send reset to server
        if (this.props.socket) {
          this.props.socket.emit('update dish', targetDish)
        } else {
          message.error('Not connect to server!')
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
  constructor(props) {
    super(props)
  }

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
        <div>{dish.readyTime}</div>
        <div className="buttonBox">
          {dish.state == SERVING && <div>Serving...</div>}
          {dish.state == READY && (
            <Tooltip title="serving">
              <button
                className="finish"
                onClick={e => this.props.handleClick(dish, 'serving', e)}
              >
                <i class="fas fa-running"></i>
              </button>
            </Tooltip>
          )}

          {dish.state == SERVING && (
            <Tooltip title="finish">
              <button
                className="finish"
                onClick={e => this.props.handleClick(dish, 'finish', e)}
              >
                <i className="fas fa-check"></i>
              </button>
            </Tooltip>
          )}

          {dish.state == SERVING && (
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

          {dish.state == READY && (
            <Popconfirm
              title="Cannot see the dish?"
              onConfirm={e => this.confirmNotSee(dish, e)}
              okText="Yes"
              cancelText="No"
            >
              <button className="fail">
                <i class="fas fa-question"></i>
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
    const dishListGroupedByTableId = groupBy(dishList, 'tableId')
    let result = []
    for (let tableId in dishListGroupedByTableId) {
      const dishes = dishListGroupedByTableId[tableId].map(dish =>
        this.renderSingleDish(dish)
      )
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
  constructor(props) {
    super(props)
  }

  renderSingleDish(dish) {
    return (
      <div className="dishBox" key={dish._id}>
        <div className="dishName">{dish.name}</div>
        <div>{dish.serveTime.toLocaleTimeString()}</div>
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
    const dishListGroupedByTableId = groupBy(dishList, 'tableId')
    let result = []
    for (let tableId in dishListGroupedByTableId) {
      const dishes = dishListGroupedByTableId[tableId].map(dish =>
        this.renderSingleDish(dish)
      )
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
