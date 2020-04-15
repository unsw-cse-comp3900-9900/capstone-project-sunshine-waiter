import React from 'react'
import { Link } from 'react-router-dom'
import 'antd/dist/antd.css'
import { Badge } from 'antd'

import '../default.css'
import { getCookie } from '../../authenticate/Cookies'
import { deleteUser, updateUser, readMe } from '../../apis/actions/users'
import { MODE } from './constant'
import RestaurantModal from './RestaurantModal'
import { deleteRestaurant } from '../../apis/actions/restaurants'
import PendingInvitationModal from './PendingInvitationModal'

class MyProfile extends React.Component {
  state = {
    mode: MODE.VIEW,
    editingName: '',
    modalVisible: false,
    editingRestaurant: null,
    inviationModalVisible: false,
    me: null,
  }

  onSetMe = data => {
    this.setState({
      me: data,
      editingName: data.name,
    })
  }

  UNSAFE_componentWillMount = async () => {
    await readMe(getCookie('token'), this.onSetMe)
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
        {this.state.mode === MODE.VIEW && this.renderViewModeBasicIcons()}
      </span>
    )
  }

  showInvitationModal = () => {
    this.setState({
      inviationModalVisible: true,
    })
  }

  onCloseInvitationModal = () => {
    this.setState({
      inviationModalVisible: false,
    })
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

  handleUserFormSubmit = async e => {
    e.preventDefault()
    const param = {
      name: this.state.editingName,
    }
    const token = getCookie('token')
    //if no this await, the setState will not update when log
    await updateUser(token, param)
    readMe(getCookie('token'), this.onSetMe)
    this.setState({ mode: MODE.VIEW })
  }

  handleFormOnChange = e => {
    this.setState({
      editingName: e.target.value,
    })
  }

  renderEditModeBasic = () => {
    return (
      <form onSubmit={this.handleUserFormSubmit}>
        <span>
          <img
            className="ui avatar image"
            src={require('../SWLogo.png')}
            alt=""
          />
          <input
            className="input"
            type="text"
            value={this.state.editingName}
            onChange={this.handleFormOnChange}
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
  }

  renderRestaurantsLists = () => {
    const { restaurants } = this.props

    //DO NOT USE <A> TAG, IT WILL RELOAD THE PAGE AND MAKE THE STATE BACK INITIAL STATE IN App.js
    if (restaurants && restaurants.length > 0) {
      return restaurants.map(({ _id, name, description }) => (
        <li className="list" key={_id}>
          {name}
          <span onClick={() => this.onDeleteRestaurant(_id)}>
            <i className="trash alternate outline icon right clickable" />
          </span>
          <span
            onClick={() => {
              this.showModal()
              this.setState({ editingRestaurant: { _id, name, description } })
            }}
          >
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

  renderViewModeBasicIcons = () => {
    return (
      <span>
        <span
          className="clickable right"
          style={{ marginRight: '5px' }}
          onClick={this.showInvitationModal}
        >
          <Badge count={5}>
            <i className="icon mail" />
          </Badge>
        </span>
        <span
          className="clickable right"
          onClick={() => this.setState({ mode: MODE.EDIT })}
        >
          <i className="pencil alternate small icon" />
        </span>
      </span>
    )
  }

  render() {
    const { updateState } = this.props
    if (this.state.me === null) {
      return null
    }

    const { _id, name, email, avatar } = this.state.me
    return (
      <div className="profile">
        <PendingInvitationModal
          visible={this.state.inviationModalVisible}
          onCancel={this.onCloseInvitationModal}
        />
        <div className="basic">
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
        <RestaurantModal
          visible={this.state.modalVisible}
          onCancel={this.handleModalCancel}
          editingRestaurant={this.state.editingRestaurant}
        />
        <div className="my-restaurant">
          <h3>
            <i className="coffee icon" />
            My Restaurants
            <span
              onClick={() => {
                this.setState({ editingRestaurant: null })
                this.showModal()
              }}
            >
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
