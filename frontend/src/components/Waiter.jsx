import React from 'react'
import './Waiter.css'

const READY = 'READY'
const SERVED = 'SERVED'
const FAILED = 'FAILED'

const fakeDishes = {
  djieq34q329r: {
    _id: 'djieq34q329r',
    name: 'orange',
    readyTime: 1584510589,
    tableId: 't27',
    orderId: 'fdwji1ri23234',
    state: READY, //canbe SERVED
    serveTime: null,
  },
  ejiri429999w: {
    _id: 'ejiri429999w',
    name: 'plum',
    readyTime: 1584511060,
    tableId: 't28',
    orderId: 'fdafr89891ruq',
    state: READY, //canbe SERVED
    serveTime: null,
  },
  djieq34q379r: {
    _id: 'djieq34q379r',
    name: 'apple',
    readyTime: 1584511154,
    tableId: 't27',
    orderId: 'fdwji1ri23234',
    state: READY, //canbe SERVED
    serveTime: null,
  },
}

const fakeNewDish = {
  _id: 'djieq34q569r',
  name: 'egg',
  readyTime: 1584512368,
  tableId: 't28',
  orderId: 'fdafr89891ruq',
  state: READY, //canbe SERVED or FAIL
  serveTime: null,
}

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
      dishList: fakeDishes,
      // dishQue: groupBy(fakeDishes, 'tableId'), // Currently use a fake dish list to test
      finished: {},
      failed: {},
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(dish_id, action, e) {
    var newDishList = { ...this.state.dishList }
    var newFinished = { ...this.state.finished }
    var newFailed = { ...this.state.failed }
    var targetDish = { ...newDishList[dish_id] }
    delete newDishList[dish_id]
    switch (action) {
      case 'finish':
        targetDish.state = SERVED
        targetDish.serveTime = new Date().toLocaleDateString()
        newFinished[dish_id] = targetDish
        console.log('dish finished!!!!')
        console.log(newFinished)

        // TODO: send finished dish to server

        this.setState({
          dishList: newDishList,
          finished: newFinished,
        })
        break
      case 'failed':
        targetDish.state = FAILED
        targetDish.serveTime = new Date().toLocaleDateString()
        newFailed[dish_id] = targetDish

        // TODO: send failed dish to server

        this.setState({
          dishList: newDishList,
          finished: newFailed,
        })
        break
      case 'reset':
        targetDish = newFinished[dish_id] || newFailed[dish_id]
        targetDish.state = READY
        targetDish.serveTime = null
        newDishList[dish_id] = targetDish
        delete newFinished[dish_id]

        // TODO: send reset to server

        this.setState({
          dishList: newDishList,
          finished: newFinished,
        })
      default:
        return
    }
  }

  render() {
    return (
      <div className="box">
        <h2>Dishes</h2>
        <RenderDishes
          dishList={this.state.dishList}
          handleClick={this.handleClick}
        />

        {Object.keys(this.state.finished).length > 0 && <h2>Finished</h2>}

        <RenderFinished
          dishList={this.state.finished}
          handleClick={this.handleClick}
        />
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
        <div>{dish.name}</div>
        <div>{dish.readyTime}</div>
        <div>
          <button onClick={e => this.props.handleClick(dish._id, 'finish', e)}>
            finish
          </button>
          <button onClick={e => this.props.handleClick(dish._id, 'failed', e)}>
            failed
          </button>
        </div>
      </div>
    )
    return <div>{dish.state == READY && renderedDish}</div>
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
        <div>{dish.name}</div>
        <div>{dish.readyTime}</div>
        <div>
          <button onClick={e => this.props.handleClick(dish._id, 'reset', e)}>
            reset
          </button>
        </div>
        <div>
          {dish.state == SERVED && (
            <h2>
              <span role="img" aria-label="tick">
                ☑️
              </span>
            </h2>
          )}
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

class Request extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      requestQue: [
        {
          table: 2,
          time: '18:55',
        },
      ],
      finished: [],
    }
  }

  render() {
    return (
      <div className="box">
        <h2>Requests</h2>
      </div>
    )
  }
}

const Waiter = () => (
  <div>
    <header>
      <h1 id="welcome-message">Welcome to the Waiter Page.</h1>
    </header>

    <div id="box-container">
      <Dishes />
      <Request />
    </div>
  </div>
)

export default Waiter
