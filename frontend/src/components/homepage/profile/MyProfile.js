import React from 'react'
import 'antd/dist/antd.css'
import { Badge } from 'antd'

import '../default.css'
import { getCookie } from '../../authenticate/Cookies'
import { deleteUser, updateUser, readMe } from '../../apis/actions/users'
import { MODE } from './constant'
import RestaurantModal from './RestaurantModal'
import { deleteRestaurant } from '../../apis/actions/restaurants'
import PendingInvitationModal from './PendingInvitationModal'
import OwnedRestaurants from './OwnedRestaurants'
import WorkAtRestaurants from './WorkAtRestaurants'
import { Polling } from '../../apis/Polling'
import { compareTwoArraysOfInvitationObj } from '../../services'
import ImageUploadModal from '../../imageUpload/ImageUploadModal'

const baseURL = 'http://localhost:8000'

class MyProfile extends React.Component {
  state = {
    mode: MODE.VIEW,
    editingName: '',
    modalVisible: false,
    editingRestaurant: null,
    inviationModalVisible: false,
    me: null,
    pendingJobs: [],
    currentJobs: null,
    imageUploadModalVisible: false,
    avatarUrl: '',
    isLoading: true,
  }

  onSetPendingJobs = data => {
    const { currentJobs, pendingJobs, img } = data
    if (img.originalname !== undefined && !this.state.avatarUrl) {
      this.setState({
        avatarUrl: baseURL + img.relativePath,
      })
    }
    if (this.state.currentJobs === null) {
      this.setState({
        currentJobs,
      })
    } else if (
      !compareTwoArraysOfInvitationObj(this.state.currentJobs, currentJobs) ||
      !compareTwoArraysOfInvitationObj(currentJobs, this.state.currentJobs)
    ) {
      this.setState({
        currentJobs,
      })
    }

    //update only when pendingJobs are different
    if (
      !compareTwoArraysOfInvitationObj(this.state.pendingJobs, pendingJobs) ||
      !compareTwoArraysOfInvitationObj(pendingJobs, this.state.pendingJobs)
    ) {
      this.setState({
        pendingJobs,
      })
    }
  }

  onSetMe = data => {
    const { img } = data

    if (this.state.isLoading) {
      this.setState({
        isLoading: false,
      })
    }
    if (img.originalname !== undefined) {
      this.setState({
        avatarUrl: baseURL + img.relativePath,
      })
    }
    this.setState({
      me: data,
      editingName: data.name,
    })
  }

  onSetEditingRestaurant = param => {
    this.setState({ editingRestaurant: param })
  }

  UNSAFE_componentWillMount = async () => {
    await readMe(getCookie('token'), this.onSetMe)
  }

  componentDidMount = () => {
    Polling(timer => readMe(getCookie('token'), this.onSetPendingJobs), 4000)
  }

  renderViewModeBasic = name => {
    return (
      <span>
        <span
          className="clickable"
          onClick={() => {
            this.setState({ imageUploadModalVisible: true })
          }}
        >
          <img
            className="ui avatar image"
            src={
              this.state.isLoading
                ? ''
                : this.state.avatarUrl
                ? this.state.avatarUrl
                : require('../../homepage/SWLogo.png')
            }
            alt=""
          />
        </span>
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
            src={
              this.state.isLoading
                ? ''
                : this.state.avatarUrl
                ? this.state.avatarUrl
                : require('../../homepage/SWLogo.png')
            }
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

  renderViewModeBasicIcons = () => {
    return (
      <span>
        <span
          className="clickable right"
          style={{ marginRight: '5px' }}
          onClick={this.showInvitationModal}
        >
          <Badge count={this.state.pendingJobs.length}>
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

  renderImageUploadModal = () => {
    const params = {
      token: getCookie('token'),
    }
    return (
      <ImageUploadModal
        visible={this.state.imageUploadModalVisible}
        onCancel={() => {
          this.setState({
            imageUploadModalVisible: false,
          })
        }}
        tag="avatar"
        params={params}
      />
    )
  }

  render() {
    const { updateState } = this.props
    if (this.state.me === null) {
      return null
    }

    const { _id, name, email } = this.state.me
    return (
      <div className="profile">
        {this.renderImageUploadModal()}
        <PendingInvitationModal
          visible={this.state.inviationModalVisible}
          onCancel={this.onCloseInvitationModal}
          pendingJobs={this.state.pendingJobs}
        />
        <RestaurantModal
          visible={this.state.modalVisible}
          onCancel={this.handleModalCancel}
          editingRestaurant={this.state.editingRestaurant}
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
        <OwnedRestaurants
          showModal={this.showModal}
          onDeleteRestaurant={this.onDeleteRestaurant}
          onSetEditingRestaurant={this.onSetEditingRestaurant}
        />
        <span className="ui horizontal divider" />
        <WorkAtRestaurants currentJobs={this.state.currentJobs} />
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
