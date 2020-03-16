import React from 'react'

class DishItemCard extends React.Component {
  render() {
    const { title, image, description } = this.props
    console.log(image)
    return (
      <div className="card" style={{ height: '250px' }}>
        <div className="content">
          <div className="ui small image">
            <img src={require('../services/statics/Beef.jpg')} alt="" />
          </div>
          <div className="header">{title}</div>
          <div className="description">{description}</div>
          <div
            className="ui bottom attached button"
            style={{
              position: ' absolute',
              bottom: '10px',
            }}
          >
            <i className="plus circle icon"></i>
            Cart
          </div>
        </div>
      </div>
    )
  }
}

export default DishItemCard
