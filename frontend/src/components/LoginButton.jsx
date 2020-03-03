import React from 'react'

class LoginButton extends React.Component {
  renderAuthButton = () => {
    const { isAuthenticated } = this.props
    if (!isAuthenticated) {
      return (
        <button className="ui primary google button">
          <i className="google icon" />
          Sign In with Google
        </button>
      )
    } else {
      return (
        <button className="ui red google button">
          <i className="google icon" />
          Sign out
        </button>
      )
    }
  }
  render() {
    return <div>{this.renderAuthButton()}</div>
  }
}

export default LoginButton
