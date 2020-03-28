import React from 'react'

import '../default.css'
import { getCookie } from '../../authenticate/Cookies'
import { deleteUser, updateUser } from '../../apis/actions/users'
import { MODE } from './constant'

class MyProfile extends React.Component {
  state = {
    mode: MODE.VIEW,
    editingUser: {
      name: '',
      password: '',
    },
  }

  componentDidMount = () => {
    if (this.props.profile.user !== null) {
      const { name } = this.props.profile.user
      this.setState({
        editingUser: {
          name: name,
        },
      })
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

  render() {
    const { profile, updateState } = this.props
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
        <div className="my-restaurant">
          <h3>
            <i className="coffee icon" />
            My Restaurants
          </h3>
          <span>
            Restaurant 1
            <a href="/restaurants/1" target="_blank">
              <i className="caret square right icon" />
            </a>
          </span>
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
