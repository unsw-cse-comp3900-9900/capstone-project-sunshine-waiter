import React from 'react'
import './Waiter.css'
import io from 'socket.io-client'

const READY = 'READY'
const SERVED = 'SERVED'
const FAILED = 'FAILED'

const URL = 'http://localhost:8000'

const fakeDishes = [
  {
    _id: '5e7757ad436ac0921c752df6',
    name: 'chicken',
    readyTime: '2020-02-29T09:40:26',
    tableId: 't02',
    orderId: 'o5e7757ad3348d98d4626726b',
    state: 'READY',
    serveTime: null,
  },
  {
    _id: '5e7757ad79909dc8d7c0b7c5',
    name: 'egg',
    readyTime: '2015-03-15T12:38:43',
    tableId: 't07',
    orderId: 'o5e7757add55595320f4d8bfc',
    state: 'READY',
    serveTime: null,
  },
  {
    _id: '5e7757adb920469ab73fa011',
    name: 'apple',
    readyTime: '2019-09-08T12:07:29',
    tableId: 't02',
    orderId: 'o5e7757add1682138aa58168c',
    state: 'READY',
    serveTime: null,
  },
  {
    _id: '5e7757ad8823eb44fba1c882',
    name: 'egg',
    readyTime: '2015-07-09T11:59:28',
    tableId: 't07',
    orderId: 'o5e7757ad8993169e6333c48f',
    state: 'READY',
    serveTime: null,
  },
  {
    _id: '5e7757ad8fcbd74264e205a4',
    name: 'burger',
    readyTime: '2020-01-02T04:24:48',
    tableId: 't04',
    orderId: 'o5e7757ad6b2181fe2c37aabe',
    state: 'READY',
    serveTime: null,
  },
  {
    _id: '5e7757ad3fd5d544cdf45800',
    name: 'lamb',
    readyTime: '2018-02-28T11:12:55',
    tableId: 't07',
    orderId: 'o5e7757adae623e0ad0ed9514',
    state: 'READY',
    serveTime: null,
  },
  {
    _id: '5e7757adeb798c3a11953020',
    name: 'strawberry',
    readyTime: '2019-05-01T11:00:20',
    tableId: 't07',
    orderId: 'o5e7757ad113a4dc2414dcb29',
    state: 'READY',
    serveTime: null,
  },
  {
    _id: '5e7757ad9dc69ff56b29d543',
    name: 'banana',
    readyTime: '2015-02-18T03:08:29',
    tableId: 't08',
    orderId: 'o5e7757ad908f183a396cfea4',
    state: 'READY',
    serveTime: null,
  },
  {
    _id: '5e7757adfb5261f86514f7f6',
    name: 'egg',
    readyTime: '2014-05-27T01:51:52',
    tableId: 't03',
    orderId: 'o5e7757adf656689d7bc19657',
    state: 'READY',
    serveTime: null,
  },
  {
    _id: '5e7757adf8aa017839981844',
    name: 'lamb',
    readyTime: '2018-04-05T08:00:51',
    tableId: 't02',
    orderId: 'o5e7757ada422e12b36d053b8',
    state: 'READY',
    serveTime: null,
  },
  {
    _id: '5e7757ad221118944828a168',
    name: 'egg',
    readyTime: '2014-02-10T01:59:54',
    tableId: 't02',
    orderId: 'o5e7757ad51c86e54713dc575',
    state: 'READY',
    serveTime: null,
  },
  {
    _id: '5e7757ad2a8b89af622f1e28',
    name: 'chicken',
    readyTime: '2016-04-15T01:26:27',
    tableId: 't05',
    orderId: 'o5e7757ada4adb430da7d8f7c',
    state: 'READY',
    serveTime: null,
  },
  {
    _id: '5e7757ad5d0b74503f7af746',
    name: 'beef',
    readyTime: '2014-08-20T02:58:01',
    tableId: 't02',
    orderId: 'o5e7757ad53f4787bc89d29f8',
    state: 'READY',
    serveTime: null,
  },
  {
    _id: '5e7757ad54449d92b938d8b8',
    name: 'egg',
    readyTime: '2017-01-11T01:24:54',
    tableId: 't04',
    orderId: 'o5e7757ad738622cb86b25621',
    state: 'READY',
    serveTime: null,
  },
  {
    _id: '5e7757ad95d6d8308062cbfb',
    name: 'burger',
    readyTime: '2015-11-06T08:54:59',
    tableId: 't02',
    orderId: 'o5e7757adf9844ac7a4b95c96',
    state: 'READY',
    serveTime: null,
  },
  {
    _id: '5e7757ad62d8ad41d388314d',
    name: 'beef',
    readyTime: '2016-05-19T10:44:28',
    tableId: 't01',
    orderId: 'o5e7757ad2e61869e1f94fbac',
    state: 'READY',
    serveTime: null,
  },
  {
    _id: '5e7757ad8e0ab36056617cff',
    name: 'lamb',
    readyTime: '2016-07-15T10:25:27',
    tableId: 't08',
    orderId: 'o5e7757ad3a168a5d7ef6539b',
    state: 'READY',
    serveTime: null,
  },
  {
    _id: '5e7757ade7ac7db911f0a5c9',
    name: 'egg',
    readyTime: '2019-06-29T12:31:13',
    tableId: 't07',
    orderId: 'o5e7757ada947e38e79ad80c1',
    state: 'READY',
    serveTime: null,
  },
  {
    _id: '5e7757adcab4dede23cb48ed',
    name: 'banana',
    readyTime: '2020-03-09T01:50:39',
    tableId: 't01',
    orderId: 'o5e7757ad289057e94750be7a',
    state: 'READY',
    serveTime: null,
  },
  {
    _id: '5e7757ad04612e9f9d69024e',
    name: 'burger',
    readyTime: '2018-11-25T06:52:48',
    tableId: 't06',
    orderId: 'o5e7757ad85104e67c260fbe8',
    state: 'READY',
    serveTime: null,
  },
]

const fakeRequests = [
  {
    _id: '5e775922fd9ab22bbc697f55',
    receiveTime: '08:14:29',
    tableId: 't02',
    finishTime: null,
  },
  {
    _id: '5e775922bb940e1dd20c073a',
    receiveTime: '04:20:07',
    tableId: 't05',
    finishTime: null,
  },
  {
    _id: '5e775922ba88189e8425465e',
    receiveTime: '01:55:42',
    tableId: 't01',
    finishTime: null,
  },
  {
    _id: '5e775922e43feae2e27039c4',
    receiveTime: '10:58:16',
    tableId: 't06',
    finishTime: null,
  },
  {
    _id: '5e7759223acab0ac7370562b',
    receiveTime: '10:11:00',
    tableId: 't02',
    finishTime: null,
  },
  {
    _id: '5e77592211d551716be06106',
    receiveTime: '10:24:17',
    tableId: 't05',
    finishTime: null,
  },
  {
    _id: '5e775922d2c5188eecbfc34f',
    receiveTime: '10:45:44',
    tableId: 't08',
    finishTime: null,
  },
  {
    _id: '5e7759223367189750368333',
    receiveTime: '08:26:24',
    tableId: 't03',
    finishTime: null,
  },
  {
    _id: '5e7759222f0f581c3bbba18c',
    receiveTime: '05:49:07',
    tableId: 't05',
    finishTime: null,
  },
  {
    _id: '5e775922a371a02702765f99',
    receiveTime: '05:00:55',
    tableId: 't07',
    finishTime: null,
  },
  {
    _id: '5e77592262ff4993bb0f216c',
    receiveTime: '06:31:58',
    tableId: 't02',
    finishTime: null,
  },
  {
    _id: '5e775922ff72974ce1fcc279',
    receiveTime: '08:53:28',
    tableId: 't02',
    finishTime: null,
  },
  {
    _id: '5e775922d5faaf0d6e45ce3e',
    receiveTime: '10:13:58',
    tableId: 't06',
    finishTime: null,
  },
  {
    _id: '5e7759221d641b8a5fcb453d',
    receiveTime: '04:21:42',
    tableId: 't02',
    finishTime: null,
  },
  {
    _id: '5e7759224c48a35ada55ea44',
    receiveTime: '04:52:37',
    tableId: 't01',
    finishTime: null,
  },
  {
    _id: '5e775922c56a2d2692b7c0e3',
    receiveTime: '02:19:05',
    tableId: 't04',
    finishTime: null,
  },
  {
    _id: '5e7759222dfbbf56d94fe56e',
    receiveTime: '02:57:33',
    tableId: 't01',
    finishTime: null,
  },
  {
    _id: '5e775922616faf8f7f82baca',
    receiveTime: '03:13:54',
    tableId: 't05',
    finishTime: null,
  },
  {
    _id: '5e77592292490e30fc4a8885',
    receiveTime: '04:04:04',
    tableId: 't04',
    finishTime: null,
  },
  {
    _id: '5e7759228e50fe43e4a8737a',
    receiveTime: '03:43:47',
    tableId: 't08',
    finishTime: null,
  },
]

const fakeNewDish = {
  _id: 'djieq34q569r',
  name: 'egg',
  readyTime: new Date(),
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

const arrayToObj = array => {
  var result = {}
  for (var item of array) {
    result[item._id] = item
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

        // TODO: send finished dish to server

        this.setState({
          finished: newFinished,
        })
        this.props.handleDishChange(newDishQue)
        break
      case 'failed':
        targetDish.state = FAILED
        targetDish.serveTime = new Date()
        newFailed[dish_id] = targetDish

        // TODO: send failed dish to server

        this.setState({
          failed: newFailed,
        })
        this.props.handleDishChange(newDishQue)
        break
      case 'reset':
        targetDish = newFinished[dish_id] || newFailed[dish_id]
        targetDish.state = READY
        targetDish.serveTime = null
        newDishQue[dish_id] = targetDish
        delete newFinished[dish_id]

        // TODO: send reset to server

        this.setState({
          finished: newFinished,
        })
        this.props.handleDishChange(newDishQue)
        break
      default:
        return
    }
  }

  render() {
    return (
      <div className="half">
        <h2>Dishes</h2>
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
          <button onClick={e => this.props.handleClick(dish._id, 'finish', e)}>
            <i className="fas fa-check"></i>
          </button>
          <button onClick={e => this.props.handleClick(dish._id, 'failed', e)}>
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
          <button onClick={e => this.props.handleClick(dish._id, 'reset', e)}>
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

class Request extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      finished: {},
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(request_id, action, e) {
    var newRequestQue = { ...this.props.requestQue }
    var newFinished = { ...this.state.finished }
    var targetRequest = newRequestQue[request_id]
    delete newRequestQue[request_id]

    switch (action) {
      case 'finish':
        targetRequest.finishTime = new Date() // record the finish time
        newFinished[request_id] = targetRequest

        // TODO: send finished request to the server

        this.setState({
          finished: newFinished,
        })
        this.props.handleRequestChange(newRequestQue)
        break
      default:
        return // do nothing
    }
  }

  render() {
    return (
      <div className="half">
        <h2>Requests</h2>
        <div className="box">
          <RenderRequests
            requestQue={this.props.requestQue}
            handleClick={this.handleClick}
          />
        </div>
      </div>
    )
  }
}

class RenderRequests extends React.Component {
  constructor(props) {
    super(props)
  }

  renderSingleRequest(request) {
    return (
      <div className="requestBox" key={request._id}>
        <div className="table">Table: {request.tableId}</div>
        <div>{request.receiveTime}</div>
        <div className="buttonBox">
          <button
            onClick={e => this.props.handleClick(request._id, 'finish', e)}
          >
            <i className="fas fa-check"></i>
          </button>
        </div>
      </div>
    )
  }

  render() {
    const requestQue = this.props.requestQue
    var result = objToArray(requestQue).map(request =>
      this.renderSingleRequest(request)
    )

    return <div>{result}</div>
  }
}

class Waiter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dishQue: {},
      requestQue: fakeRequests,
    }
    this.handleDishChange = this.handleDishChange.bind(this)
    this.handleRequestChange = this.handleRequestChange.bind(this)
  }

  newDish = dish => {
    console.log(dish)
    const newDishQue = { ...this.state.dishQue }
    newDishQue[dish._id] = dish
    this.setState({
      dishQue: newDishQue,
    })
  }

  newRequest = request => {
    const newRequests = { ...this.props.requests }
    newRequests[request._id] = request
    this.setState({
      requestQue: newRequests,
    })
  }

  handleDishChange(newDishQue) {
    this.setState({
      dishQue: newDishQue,
    })
  }

  handleRequestChange(newRequests) {
    this.setState({
      requestQue: newRequests,
    })
  }

  // TODO: handleServe, handleFail

  componentDidMount() {
    // Start connection
    const socket = io.connect(URL)
    socket.emit('authenticate', {
      restaurantId: 'restaurant1',
      userId: 'user1',
      userType: 'waiter',
      password: 'password',
    })
    socket.on('authenticate success', namespace => {
      const safeConnect = io.connect(URL + namespace)
      alert('connect established')
      safeConnect.on('new dish', this.newDish)
    })
  }

  render() {
    return (
      <div>
        <header>
          <h1 id="welcome-message">Welcome to the Waiter Page.</h1>
        </header>
        <div id="box-container">
          <Dishes
            handleDishChange={this.handleDishChange}
            dishQue={this.state.dishQue}
          />
          <Request
            handleRequestChange={this.handleRequestChange}
            requestQue={this.state.requestQue}
          />
        </div>
      </div>
    )
  }
}

export default Waiter
