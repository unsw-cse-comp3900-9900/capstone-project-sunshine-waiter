import React from 'react'
import { Link } from 'react-router-dom'
import { List, message } from 'antd'
import InfiniteScroll from 'react-infinite-scroller'

import { resignRole } from '../../apis/actions/invitation'
import { getCookie } from '../../authenticate/Cookies'
import '../default.css'
import './scrollerContainer.css'
import Spinner from '../../Spinner'
// import { getCookie } from '../../authenticate/Cookies'
// import { getSingleRestaurant } from '../../apis/actions/restaurants'

class WorkAtRestaurants extends React.Component {
  state = {
    isLoading: true,
    name: '',
  }

  onSetState = ({ name }) => {
    this.setState({
      name,
    })
  }

  onResignRole = params => {
    resignRole(getCookie('token'), params)
  }

  componentDidUpdate = prevProps => {
    if (this.state.isLoading && this.props.currentJobs !== null) {
      this.setState({
        isLoading: false,
      })
    }
  }

  renderRestaurantItem = ({ restaurant, role }) => {
    // This will cause a Network error after a certain time, don't know why yet
    // getSingleRestaurant(getCookie('token'), restaurant, this.onSetState)

    return (
      <List.Item key={restaurant}>
        <List.Item.Meta
          title={role}
          description={`work at ${this.state.name}`}
        />
        {role === 'manager' ? (
          <Link to={'/restaurants/' + restaurant}>
            <i className="caret square right icon" />
          </Link>
        ) : (
          <Link to={'/restaurants/' + restaurant + '/' + role}>
            <i className="caret square right icon" />
          </Link>
        )}
        <span onClick={() => this.onResignRole({ restaurant, role })}>
          <i className="trash alternate outline icon right clickable" />
        </span>
      </List.Item>
    )
  }

  renderWorkAtRestaurantsList = () => {
    // const { workAtRestaurants } = this.state
    const { currentJobs } = this.props

    if (currentJobs !== null && currentJobs.length > 0) {
      return (
        <List
          dataSource={currentJobs}
          renderItem={this.renderRestaurantItem}
        ></List>
      )
    }
    if (this.state.isLoading) {
      return <Spinner />
    }
    return null
  }

  render() {
    return (
      <div className="my-restaurant">
        <h4>
          <i className="briefcase icon" />
          Positions
        </h4>
        <div className="scroller-container">
          {this.renderWorkAtRestaurantsList() === null ? null : (
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={() => message.info("You've loaded all", 1)}
              hasMore={false}
              useWindow={false}
            >
              {this.renderWorkAtRestaurantsList()}
            </InfiniteScroll>
          )}
        </div>
      </div>
    )
  }
}

export default WorkAtRestaurants
