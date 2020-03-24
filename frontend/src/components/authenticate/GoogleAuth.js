import React from 'react'

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
        <button
          className="ui primary google button"
          onClick={this.onSignIn}
          style={{ width: '210px' }}
        >
          <i className="google icon" />
          Sign Up with Google
        </button>
      )
    } else {
      return (
        <div>
          <button
            className="ui basic big button"
            onClick={this.onSignOut}
            style={{ width: '210px', fontSize: '15px' }}
          >
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
