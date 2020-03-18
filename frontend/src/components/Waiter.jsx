import React from 'react'
import './Waiter.css'

const Dish = props => {
  const { name, id, table, time } = props.info
  return (
    <div>
      <div>name: {name}</div>
      <div>id: {id}</div>
      <div>table: {table}</div>
      <div>time: {time}</div>
    </div>
  )
}

class DishesToServe extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dishQue: [
        {
          name: 'hamberger',
          id: 1,
          table: 2,
          time: '18:55',
        },
        {
          name: 'egg',
          id: 2,
          table: 4,
          time: '16:55',
        },
      ],

      finished: [],
    }
  }

  renderDishes() {
    return this.state.dishQue.map(dish => {
      return (
        <tr key={dish._id}>
          <td>{dish.name}</td>
          <td>{dish.table}</td>
          <td>{dish.time}</td>
          <td>
            <button>Done</button>
          </td>
        </tr>
      )
    })
  }

  render() {
    const dishQue = this.state.dishQue
    return (
      <div className="box">
        <h2>Dishes</h2>
      </div>
    )
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

  renderRequests() {
    return this.state.requestQue.map(request => {
      return (
        <tr key={request._id}>
          <td>{request.table}</td>
          <td>{request.time}</td>
          <td>
            <button>Done</button>
          </td>
        </tr>
      )
    })
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
      <DishesToServe />
      <Request />
    </div>
  </div>
)

export default Waiter
