import React from 'react'
import { message, Tooltip } from 'antd'
import QueueAnim from 'rc-queue-anim'

const objToArray = obj => {
  let result = []
  for (let key in obj) {
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
  }

  handleClick = (request, action, e) => {
    if (this.props.socket === null || this.props.socket.disconnected) {
      message.error('Not connect to server!')
      return
    }
    let newFinished = { ...this.state.finished }
    let targetRequest = request

    switch (action) {
      case 'finish':
        targetRequest.handleBy = this.props.user
        targetRequest.finishTime = new Date() // record the finish time
        newFinished[request._id] = targetRequest

        // send finished request to the server
        if (this.props.socket) {
          this.props.socket.emit('update request', targetRequest)
          this.setState({
            finished: newFinished,
          })
        } else {
          message.error('Not connect to server!')
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
  renderSingleRequest(request) {
    return (
      <div className="requestBox" key={request._id}>
        <div className="table">Table: {request.tableId}</div>
        <div>{request.receiveTime}</div>
        <div className="buttonBox">
          <Tooltip title="finish">
            <button
              className="finish"
              onClick={e => this.props.handleClick(request, 'finish', e)}
            >
              <i className="fas fa-check"></i>
            </button>
          </Tooltip>
        </div>
      </div>
    )
  }

  render() {
    const requestQue = this.props.requestQue
    let result = objToArray(requestQue).map(request =>
      this.renderSingleRequest(request)
    )

    return <QueueAnim>{result}</QueueAnim>
  }
}

export default Request
