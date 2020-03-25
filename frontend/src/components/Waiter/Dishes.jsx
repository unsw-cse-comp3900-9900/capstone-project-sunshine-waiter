import React from 'react'

const READY = 'READY'
const SERVED = 'SERVED'
const FAILED = 'FAILED'
const SERVING = 'SERVING'

const objToArray = obj => {
  var result = []
  for (var key in obj) {
    result.push(obj[key])
  }
  return result
}

const groupBy = (obj, key) => {
  var array = objToArray(obj)
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

  handleClick(dish_id, action, e) {
    var newDishQue = { ...this.props.dishQue }
    var newFinished = { ...this.state.finished }
    var newFailed = { ...this.state.failed }
    var targetDish = { ...newDishQue[dish_id] }
    delete newDishQue[dish_id]
    switch (action) {
      case 'finish':
        targetDish.state = SERVED
        targetDish.serveTime = new Date()
        newFinished[dish_id] = targetDish

        // send finished dish to server
        if (this.props.socket) {
          this.props.socket.emit('update dish', targetDish)
          this.setState({
            finished: newFinished,
          })
          this.props.handleDishChange(objToArray(newDishQue))
        } else {
          alert('Not connect to server!')
        }
        break

      case 'failed':
        targetDish.state = FAILED
        targetDish.serveTime = new Date()
        newFailed[dish_id] = targetDish

        // send failed dish to server
        if (this.props.socket) {
          this.props.socket.emit('update dish', targetDish)
          this.setState({
            failed: newFailed,
          })
          this.props.handleDishChange(objToArray(newDishQue))
        } else {
          alert('Not connect to server!')
        }

        break
      case 'reset':
        targetDish = newFinished[dish_id] || newFailed[dish_id]
        targetDish.state = READY
        targetDish.serveTime = null
        newDishQue[dish_id] = targetDish
        delete newFinished[dish_id]

        // send reset to server
        if (this.props.socket) {
          this.props.socket.emit('update dish', targetDish)
          this.setState({
            finished: newFinished,
          })
          this.props.handleDishChange(objToArray(newDishQue))
        } else {
          alert('Not connect to server!')
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

          {Object.keys(this.state.finished).length > 0 && <h2>Finished</h2>}

          <RenderFinished
            dishList={this.state.finished}
            handleClick={this.handleClick}
          />
        </div>
      </div>
    )
  }
}

class RenderDishes extends React.Component {
  constructor(props) {
    super(props)
  }

  renderSingleDish(dish) {
    const renderedDish = (
      <div className="dishBox" key={dish._id}>
        <div className="dishName">{dish.name}</div>
        <div>{dish.readyTime}</div>
        <div className="buttonBox">
          <button
            className="finish"
            onClick={e => this.props.handleClick(dish._id, 'finish', e)}
          >
            <i className="fas fa-check"></i>
          </button>
          <button
            className="fail"
            onClick={e => this.props.handleClick(dish._id, 'failed', e)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    )
    return renderedDish
  }

  render() {
    const dishList = this.props.dishList
    const dishListGroupedByTableId = groupBy(dishList, 'tableId')
    var result = []
    for (var tableId in dishListGroupedByTableId) {
      const dishes = dishListGroupedByTableId[tableId].map(dish =>
        this.renderSingleDish(dish)
      )
      const tableBox = (
        <div className="tableBox" key={tableId}>
          <h3>Table: {tableId}</h3>
          {dishes}
        </div>
      )
      result.push(tableBox)
    }
    return <div>{result}</div>
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
          <button
            className="reset"
            onClick={e => this.props.handleClick(dish._id, 'reset', e)}
          >
            <i className="fas fa-undo-alt"></i>
          </button>
        </div>
      </div>
    )
  }

  render() {
    const dishList = this.props.dishList
    const dishListGroupedByTableId = groupBy(dishList, 'tableId')
    var result = []
    for (var tableId in dishListGroupedByTableId) {
      const dishes = dishListGroupedByTableId[tableId].map(dish =>
        this.renderSingleDish(dish)
      )
      const tableBox = (
        <div className="tableBox" key={tableId}>
          <h3>Table: {tableId}</h3>
          {dishes}
        </div>
      )
      result.push(tableBox)
    }
    return <div>{result}</div>
  }
}

export default Dishes
