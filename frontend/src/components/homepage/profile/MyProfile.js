import React from 'react'
import { Link } from 'react-router-dom'
import 'antd/dist/antd.css'

import '../default.css'
import { getCookie } from '../../authenticate/Cookies'
import { deleteUser, updateUser } from '../../apis/actions/users'
import { MODE } from './constant'
import CreateRestaurantModal from './CreateRestaurantModal'
import { deleteRestaurant } from '../../apis/actions/restaurants'

class MyProfile extends React.Component {
  state = {
    mode: MODE.VIEW,
    editingUser: {
      name: '',
      password: '',
    },
    modalVisible: false,
  }

  componentDidMount = () => {
    if (this.props.profile.user !== null) {
      const { name } = this.props.profile.user
      this.setState(prevState => ({
        editingUser: {
          ...prevState.editingUser,
          name: name,
        },
      }))
    }
  }

  renderViewModeBasic = name => {
    return (
      <span>
        <img
          className="ui avatar image"
          src={require('../SWLogo.png')}
          alt=""
        />
        {name}
      </span>
    )
  }

  showModal = () => {
    this.setState({
      modalVisible: true,
    })
  }

  handleModalCancel = () => {
    this.setState({
      modalVisible: false,
    })
  }

  handleSubmit = async e => {
    e.preventDefault()
    const param = {
      name: this.state.editingUser.name,
    }
    const token = getCookie('token')
    const { profile, updateState } = this.props
    //if no this await, the setState will not update when log
    await updateUser(token, param)
    updateState({
      _id: profile.user._id,
      name: this.state.editingUser.name,
      email: profile.user.email,
    })
    this.setState({ mode: MODE.VIEW })
  }

  renderEditModeBasic = () => {
    return (
      <form onSubmit={this.handleSubmit}>
        <span>
          <img
            className="ui avatar image"
            src={require('../SWLogo.png')}
            alt=""
          />
          <input
            className="input"
            type="text"
            value={this.state.editingUser.name}
            onChange={e =>
              this.setState({
                editingUser: {
                  name: e.target.value,
                },
              })
            }
          />
        </span>
        <button className="circular ui mini right icon button">
          <i className="check icon"></i>
        </button>
      </form>
    )
  }

  onDeleteRestaurant = async id => {
    await deleteRestaurant(getCookie('token'), id)
    this.props.recordRestaurantsListUpdatedStatus()
  }

  renderRestaurantsLists = () => {
    const { restaurants } = this.props

    //DO NOT USE <A> TAG, IT WILL RELOAD THE PAGE AND MAKE THE STATE BACK INITIAL STATE IN App.js
    if (restaurants && restaurants.length > 0) {
      return restaurants.map(({ _id, name }) => (
        <li className="list" key={_id}>
          {name}
          <span onClick={() => this.onDeleteRestaurant(_id)}>
            <i className="trash alternate outline icon right clickable" />
          </span>
          <span>
            <i className="pencil alternate right clickable icon" />
          </span>
          <Link to={'/restaurants/' + _id} name={name}>
            <i className="caret square right icon" />
          </Link>
        </li>
      ))
    }
    return null
  }

  render() {
    const {
      profile,
      updateState,
      recordRestaurantsListUpdatedStatus,
    } = this.props
    if (profile.user === null) {
      return null
    }

    const { _id, name, email, avatar } = profile.user
    return (
      <div className="profile">
        <div className="basic">
          {this.state.mode === MODE.VIEW && (
            <span
              className="clickable right"
              onClick={() => this.setState({ mode: MODE.EDIT })}
            >
              <i className="pencil alternate icon" />
            </span>
          )}
          <div className="name">
            {this.state.mode === MODE.VIEW
              ? this.renderViewModeBasic(name)
              : this.renderEditModeBasic()}
            <i className="address small card icon" />
            <div className="meta">UserID: {_id}</div>
            <div className="meta">Email: {email}</div>
          </div>
        </div>
        <h4 className="ui horizontal divider">
          <i className="tag icon"></i>
          Dashboard
        </h4>
        <CreateRestaurantModal
          visible={this.state.modalVisible}
          onCancel={this.handleModalCancel}
          recordRestaurantsListUpdatedStatus={
            recordRestaurantsListUpdatedStatus
          }
        />
        <div className="my-restaurant">
          <h3>
            <i className="coffee icon" />
            My Restaurants
            <span onClick={this.showModal}>
              <i className="plus circle icon right" />
            </span>
          </h3>
          {this.renderRestaurantsLists()}
        </div>
        <div className="footer">
          <div
            className="ui red button"
            onClick={() => {
              const token = getCookie('token')
              deleteUser(token, updateState)
            }}
          >
            Delete My Account
          </div>
        </div>
      </div>
    )
  }
}

export default MyProfile
