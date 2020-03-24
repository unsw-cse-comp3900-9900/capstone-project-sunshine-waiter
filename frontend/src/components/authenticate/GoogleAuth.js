import React from 'react'

import Nivagation from '../Navigation'

class GoogleAuth extends React.Component {
  state = { isSignedIn: null }

  componentDidMount = () => {
    window.gapi.load('client:auth2', () => {
      window.gapi.client
        .init({
          clientId:
            '158440109573-k7nlsq8p5fataih8aupflr0314u57mjq.apps.googleusercontent.com',
          scope: 'email',
        })
        .then(() => {
          this.auth = window.gapi.auth2.getAuthInstance()
          this.onAuthChange()
          this.auth.isSignedIn.listen(this.onAuthChange)
        })
    })
  }

  onAuthChange = () => {
    this.setState({ isSignedIn: this.auth.isSignedIn.get() })
  }

  onSignIn = () => {
    this.auth.signIn()
  }

  onSignOut = () => {
    this.auth.signOut()
  }

  renderAuthButton = () => {
    const { isSignedIn } = this.state

    if (isSignedIn === null) {
      return null
    } else if (!isSignedIn) {
      return (
        <button className="ui primary google button" onClick={this.onSignIn}>
          <i className="google icon" />
          Sign In with Google
        </button>
      )
    } else {
      return (
        <div>
          <Nivagation />
          <button className="ui basic button" onClick={this.onSignOut}>
            <i className="google icon" />
            Sign out
          </button>
        </div>
      )
    }
  }
  render() {
    return <div>{this.renderAuthButton()}</div>
  }
}

export default GoogleAuth
