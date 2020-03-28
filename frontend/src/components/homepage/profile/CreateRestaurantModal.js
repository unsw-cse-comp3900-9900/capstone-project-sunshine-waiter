import React from 'react'
import { Modal } from 'antd'
import { createRestaurant } from '../../apis/actions/restaurants'
import { getCookie } from '../../authenticate/Cookies'

class CreateRestaurantModal extends React.Component {
  state = {
    name: '',
    description: '',
  }

  onSubmit = async e => {
    const { recordRestaurantsListUpdatedStatus } = this.props
    e.preventDefault()
    await createRestaurant(getCookie('token'), this.state)
    // console.log(curRestaurants, this.state)
    // updateRestaurants(curRestaurants.push(this.state))
    // console.log(curRestaurants)
    recordRestaurantsListUpdatedStatus()

    this.props.onCancel()
  }

  render() {
    const { visible, onCancel } = this.props
    return (
      <Modal visible={visible} onCancel={onCancel} onOk={this.onSubmit}>
        <form className="ui form" onSubmit={this.onSubmit}>
          <div className="field">
            <label htmlFor="name">Restaurant Name </label>
            <input
              type="text"
              id="name"
              value={this.state.name}
              onChange={e =>
                this.setState({
                  name: e.target.value,
                })
              }
            />
          </div>
          <div className="field">
            <label htmlFor="description">Description </label>
            <input
              type="text"
              id="description"
              value={this.state.description}
              onChange={e =>
                this.setState({
                  description: e.target.value,
                })
              }
            />
          </div>
        </form>
      </Modal>
    )
  }
}

export default CreateRestaurantModal
