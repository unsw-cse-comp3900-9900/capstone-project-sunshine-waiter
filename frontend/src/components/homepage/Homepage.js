import React from 'react'

import AuthCard from '../authenticate/AuthCard'
import SiderBar from './profile/SiderBar'

class Homepage extends React.Component {
  state = {
    isAuthenticated: false,
    showProfile: false,
    showLoginCard: false,
  }

  onCloseProfile = state => {
    this.setState({ showProfile: state })
  }

  onAuthenticated = state => {
    this.setState({ isAuthenticated: state })
  }

  renderAfterLogin = () => {
    return (
      <div>
        <div className="ui basic button">
          <span onClick={() => this.setState({ showProfile: true })}>
            Myprofile
          </span>
        </div>
        {this.state.showProfile && (
          <SiderBar
            visible={this.state.showProfile}
            onCloseProfile={this.onCloseProfile}
          />
        )}
      </div>
    )
  }

  renderBeforeLogin = () => {
    return (
      <div>
        {this.state.showLoginCard ? (
          <AuthCard onAuthenticated={this.onAuthenticated} />
        ) : (
          <div
            className="ui basic primary button"
            onClick={() => this.setState({ showLoginCard: true })}
          >
            Sign In
          </div>
        )}
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.state.isAuthenticated
          ? this.renderAfterLogin()
          : this.renderBeforeLogin()}
      </div>
    )
  }
}

export default Homepage
