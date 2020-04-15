import React from 'react'
import { Link } from 'react-router-dom'
import { List, message } from 'antd'
import InfiniteScroll from 'react-infinite-scroller'

class WorkAtRestaurants extends React.Component {
  state = {
    workAtRestaurants: [],
  }
  renderWorkAtRestaurantsList = () => {
    const { workAtRestaurants } = this.state
    if (workAtRestaurants && workAtRestaurants.length > 0) {
      return (
        <List
          dataSource={workAtRestaurants}
          renderItem={({ _id, name, description }) => (
            <List.Item key={_id}>
              <List.Item.Meta title={name} description={description} />
              <div>
                <Link to={'/restaurants/' + _id} name={name}>
                  <i className="caret square right icon" />
                </Link>
              </div>
            </List.Item>
          )}
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
