import React from 'react'
import { getMenus } from '../services/fakemenu'

class DishItemCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      menus: getMenus(),
      order_list: [],
    }
  }

  render() {
    const { title, image, description, cost, getorder } = this.props
    console.log('dishitemcard')

    return (
      <div className="card" style={{ height: '280px' }}>
        <div className="content">
          <div className="ui small image">
            <img
              src={require('../services/statics/MushroomPasta.jpg')}
              alt="wrong"
              max-width="100%"
            />
          </div>
          <div className="header">{title}</div>
          <div className="description">{description}</div>
          <div className="ui icon button" style={{}}>
            <i className="dollar sign icon" />
            <i>{cost}</i>
          </div>

          <div
            //onClick={() => this.handleOrder(this.props.title)}
            onClick={() => getorder(this.props.title)}
            className="ui bottom attached button"
            style={{
              position: 'absolute',
              bottom: '10px',
            }}
          >
            <i className="plus circle icon"></i>
            <i className="shop icon"></i>
          </div>
        </div>
      </div>
    )
  }
}

export default DishItemCard
