import React from 'react'
import { Link } from 'react-router-dom'
import { List, message } from 'antd'
import InfiniteScroll from 'react-infinite-scroller'
import { getCookie } from '../../authenticate/Cookies'
import { getSingleRestaurant } from '../../apis/actions/restaurants'

class WorkAtRestaurants extends React.Component {
  state = {
    name: '',
  }

  onSetState = ({ name }) => {
    this.setState({
      name,
    })
  }

  renderRestaurantItem = ({ restaurant, role }) => {
    getSingleRestaurant(getCookie('token'), restaurant, this.onSetState)

    return (
      <List.Item key={restaurant}>
        <List.Item.Meta
          title={role}
          description={`Work at ${this.state.name}`}
        />
        <Link to={'/restaurants/' + restaurant + '/' + role}>
          <i className="caret square right icon" />
        </Link>
      </List.Item>
    )
  }

  renderWorkAtRestaurantsList = () => {
    // const { workAtRestaurants } = this.state
    const { currentJobs } = this.props

    if (currentJobs.length > 0) {
      return (
        <List
          dataSource={currentJobs}
          renderItem={this.renderRestaurantItem}
        ></List>
      )
    }
    return <div>No restaurants avaliable yet</div>
  }

  render() {
    return (
      <div className="my-restaurant">
        <h4>
          <i className="coffee small icon" />
          WorkAt Restaurants
        </h4>
        <div className="scroller-container">
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={() => message.info("You've loaded all", 1)}
            hasMore={false}
            useWindow={false}
          >
            {this.renderWorkAtRestaurantsList()}
          </InfiniteScroll>
        </div>
      </div>
    )
  }
}

export default WorkAtRestaurants
