import React from 'react'

import AuthCard from '../authenticate/AuthCard'
import SiderBar from './profile/SiderBar'
import './default.css'

class Homepage extends React.Component {
  state = {
    isAuthenticated: false,
    showProfile: false,
    showLoginCard: false,
    headerMouseOver: '',
  }

  onCloseProfile = state => {
    this.setState({ showProfile: state })
  }

  onAuthenticated = state => {
    this.setState({ isAuthenticated: state, showLoginCard: !state })
  }

  onMouseEnter = header => {
    console.log(header)
    this.setState({
      headerMouseOver: header,
    })
  }

  onMouseLeave = () => {
    this.setState({
      headerMouseOver: '',
    })
  }

  renderAfterLogin = () => {
    return (
      <div>
        <div className="item">
          <span onClick={() => this.setState({ showProfile: true })}>
            Myprofile
          </span>
        </div>
      </div>
    )
  }

  renderBeforeLogin = () => {
    return (
      <div>
        {this.state.showLoginCard || (
          <div
            className="item primary"
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
      <div className="pusher">
        <div className="ui inverted vertical masthead center aligned segment">
          <div className="ui container sticky">
            <div className="ui secondary inverted pointing menu">
              <div className="left item">
                <img
                  className="ui mini circular image"
                  src={require('./SWLogo.png')}
                />
                <span
                  onMouseEnter={() => this.onMouseEnter('home')}
                  onMouseLeave={this.onMouseLeave}
                >
                  <a
                    href="/"
                    className={
                      this.state.headerMouseOver.home === 'home'
                        ? 'active item'
                        : 'item'
                    }
                  >
                    Home
                  </a>
                </span>

                <a
                  className={
                    this.state.headerMouseOver === 'about'
                      ? 'active item'
                      : 'item'
                  }
                  onMouseEnter={() => this.onMouseEnter('about')}
                  onMouseLeave={this.onMouseLeave}
                >
                  About
                </a>
              </div>
              <div>
                <a
                  className={
                    this.state.headerMouseOver === 'signin'
                      ? 'active right item'
                      : 'right item'
                  }
                  onMouseEnter={() => this.onMouseEnter('signin')}
                  onMouseLeave={this.onMouseLeave}
                >
                  {this.state.isAuthenticated
                    ? this.renderAfterLogin()
                    : this.renderBeforeLogin()}
                </a>
              </div>
            </div>
          </div>
          <div className="ui text container">
            <h1 className="ui inverted header">Welcome to Sunshine Waiter</h1>
            <h2>Custom your own ordering system for your restaurant</h2>
          </div>
        </div>
        <div className="ui vertical stripe segment">
          <div className="ui left aligned stackable grid container">
            <h1 className="header">Sunshine to The Community</h1>
            <p>
              When people go out for a meal, sometimes they need to wait for a
              long time to place order in peak time. Too long waiting time may
              make them feel frustrated and unhappy. In order to control the
              waiting time, the restuarant has to hire more waiters , which will
              increase the financial burden. Therefore, our product "waiter" is
              proposed to address these issues as well as the drawbacks
              mentioned above in the existing competitors. we are aiming to
              create a useful and easy-to-use ordering system that benefits both
              customer and resturant.
            </p>
            <p>
              When people go out for a meal, sometimes they need to wait for a
              long time to place order in peak time. Too long waiting time may
              make them feel frustrated and unhappy. In order to control the
              waiting time, the restuarant has to hire more waiters , which will
              increase the financial burden. Therefore, our product "waiter" is
              proposed to address these issues as well as the drawbacks
              mentioned above in the existing competitors. we are aiming to
              create a useful and easy-to-use ordering system that benefits both
              customer and resturant.
            </p>
            <p>
              When people go out for a meal, sometimes they need to wait for a
              long time to place order in peak time. Too long waiting time may
              make them feel frustrated and unhappy. In order to control the
              waiting time, the restuarant has to hire more waiters , which will
              increase the financial burden. Therefore, our product "waiter" is
              proposed to address these issues as well as the drawbacks
              mentioned above in the existing competitors. we are aiming to
              create a useful and easy-to-use ordering system that benefits both
              customer and resturant.
            </p>
            <p>
              When people go out for a meal, sometimes they need to wait for a
              long time to place order in peak time. Too long waiting time may
              make them feel frustrated and unhappy. In order to control the
              waiting time, the restuarant has to hire more waiters , which will
              increase the financial burden. Therefore, our product "waiter" is
              proposed to address these issues as well as the drawbacks
              mentioned above in the existing competitors. we are aiming to
              create a useful and easy-to-use ordering system that benefits both
              customer and resturant.
            </p>
          </div>
        </div>
        {this.state.showLoginCard && (
          <AuthCard onAuthenticated={this.onAuthenticated} />
        )}
        <div>
          {this.state.showProfile && (
            <SiderBar
              visible={this.state.showProfile}
              onCloseProfile={this.onCloseProfile}
            />
          )}
        </div>
        <div className="ui inverted vertical footer segment">
          <div className="ui container">
            <div className="ui stackable inverted divided equal height stackable grid">
              <div className="three wide column">
                <h4>
                  <img
                    className="ui avatar image"
                    src={require('./SWLogo.png')}
                  />
                  Powered By Sunshine Group
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Homepage
