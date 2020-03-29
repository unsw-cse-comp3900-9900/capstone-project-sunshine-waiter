import React from 'react'
import { Modal } from 'antd'
import {
  createRestaurant,
  updateRestaurant,
} from '../../apis/actions/restaurants'
import { getCookie } from '../../authenticate/Cookies'

class RestaurantModal extends React.Component {
  state = {
    name: '',
    description: '',
  }

  onSubmit = async e => {
    const { recordRestaurantsListUpdatedStatus, editingRestaurant } = this.props
    e.preventDefault()
    if (editingRestaurant !== null) {
      await updateRestaurant(
        getCookie('token'),
        editingRestaurant._id,
        this.state,
        recordRestaurantsListUpdatedStatus()
      )
    } else {
      await createRestaurant(
        getCookie('token'),
        this.state,
        recordRestaurantsListUpdatedStatus()
      )
    }

    this.props.onCancel()
  }

  UNSAFE_componentWillReceiveProps = nextProps => {
    const { editingRestaurant } = nextProps
    if (editingRestaurant !== null) {
      this.setState({
        name: editingRestaurant.name,
        description: editingRestaurant.description,
      })
    }
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
            <small>The name has to be more than 5 letters</small>
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
            <small>The description has to be more than 5 letters</small>
          </div>
        </form>
      </Modal>
    )
  }
}

export default RestaurantModal
