import React from 'react'

const objToArray = obj => {
  var result = []
  for (var key in obj) {
    result.push(obj[key])
  }
  return result
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

        // send finished request to the server
        if (this.props.socket) {
          this.props.socket.emit('update request', targetRequest)
          this.setState({
            finished: newFinished,
          })
          this.props.handleRequestChange(objToArray(newRequestQue))
        } else {
          alert('Not connect to server!')
        }

        break
      default:
        return // do nothing
    }
  }

  render() {
    return (
      <div className="half">
        <div className="title">
          <h2>Requests</h2>
        </div>
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
            className="finish"
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

export default Request
