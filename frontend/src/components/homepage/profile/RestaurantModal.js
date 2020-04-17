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
    const { editingRestaurant } = this.props
    e.preventDefault()
    console.log('thisisresturant', this.props)
    if (editingRestaurant !== null) {
      await updateRestaurant(
        getCookie('token'),
        editingRestaurant._id,
        this.state
      )
    } else {
      await createRestaurant(getCookie('token'), this.state)
    }

    this.props.onCancel()
  }

  UNSAFE_componentWillReceiveProps = nextProps => {
    const { editingRestaurant } = nextProps

    if (editingRestaurant !== null) {
      //when clicking submit, somehow it will trigger re-passing the props down to this component,
      //then this method will be triggered
      //So the currented changed new value will be replaced by the old value
      //this if statement fixes this problem
      if (this.state.name === '') {
        this.setState({
          name: editingRestaurant.name,
          description: editingRestaurant.description,
        })
      }
    } else {
      this.setState({
        name: '',
        description: '',
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
