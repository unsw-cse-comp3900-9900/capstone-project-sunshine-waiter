import React from 'react'
import { Link } from 'react-router-dom'

import AuthCard from '../authenticate/AuthCard'
import SiderBar from './profile/SiderBar'
import { getCookie, deleteCookie } from '../authenticate/Cookies'
import './default.css'
import { getUser } from '../apis/actions/users'
// import { getRestaurants } from '../apis/actions/restaurants'

class Homepage extends React.Component {
  state = {
    isAuthenticated: false,
    showProfile: false,
    showLoginCard: false,
    headerMouseOver: '',
    profile: {
      user: null,
    },
  }

  updateState = (userData, authState = true) => {
    //delete account
    if (userData === null) {
      this.setState(prevState => ({
        isAuthenticated: authState,
        showProfile: false,
        profile: {
          ...prevState.profile,
          user: userData,
        },
      }))
    } else {
      this.setState(prevState => ({
        isAuthenticated: authState,
        profile: {
          ...prevState.profile,
          user: userData,
        },
      }))
    }
  }

  // updateRestaurants = (restaurants = []) => {
  //   this.setState(prevState => ({
  //     profile: {
  //       ...prevState.profile,
  //       restaurants: restaurants,
  //     },
  //   }))
  // }

  //when there is no cookies, the getUser request will not be sent,
  //see the definition
  UNSAFE_componentWillMount = () => {
    const currentCookie = getCookie('token')
    getUser(currentCookie, this.updateState)
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevState.isAuthenticated !== this.state.isAuthenticated &&
      this.state.isAuthenticated
    ) {
      getUser(getCookie('token'), this.updateState)
      // getRestaurants(getCookie('token'), this.updateRestaurants)
      this.props.recordRestaurantsListUpdatedStatus()
    }

    // if (prevState.profile.restaurants !== this.state.profile.restaurants) {
    //   this.props.fetchRestaurants(this.state.profile.restaurants)
    // }
  }

  onAuthenticated = state => {
    this.setState({ isAuthenticated: state, showLoginCard: !state })
  }

  onCloseAuthCard = () => {
    this.setState({ showLoginCard: false })
  }

  onMouseEnter = header => {
    this.setState({
      headerMouseOver: header,
    })
  }

  onMouseLeave = () => {
    this.setState({
      headerMouseOver: '',
    })
  }

  renderLogout = () => {
    return (
      <div className="item">
        <a
          className={
            this.state.headerMouseOver === 'signout'
              ? 'active right item'
              : 'right item'
          }
          onMouseEnter={() => this.onMouseEnter('signout')}
          onMouseLeave={this.onMouseLeave}
        >
          <span
            onClick={() => {
              this.setState({
                isAuthenticated: false,
                showProfile: false,
                showLoginCard: false,
                profile: {
                  user: null,
                },
              })
              deleteCookie('token')
            }}
          >
            Log out
          </span>
        </a>
      </div>
    )
  }

  renderAfterLogin = () => {
    return (
      <div className="item">
        <a
          className={
            this.state.headerMouseOver === 'myprofile'
              ? 'active right item'
              : ' right item'
          }
          onMouseEnter={() => this.onMouseEnter('myprofile')}
          onMouseLeave={this.onMouseLeave}
        >
          <span
            onClick={() => {
              this.setState({ showProfile: !this.state.showProfile })
            }}
          >
            Myprofile
          </span>
        </a>
      </div>
    )
  }

  renderBeforeLogin = () => {
    return (
      <div className="item">
        {this.state.showLoginCard || (
          <a
            className={
              this.state.headerMouseOver === 'signin'
                ? 'active item primary'
                : 'item primary'
            }
            onMouseEnter={() => this.onMouseEnter('signin')}
            onMouseLeave={this.onMouseLeave}
          >
            <span onClick={() => this.setState({ showLoginCard: true })}>
              Sign In
            </span>
          </a>
        )}
      </div>
    )
  }

  render() {
    const { recordRestaurantsListUpdatedStatus, restaurants } = this.props
    return (
      <div className="pusher">
        <div className="ui inverted vertical masthead center aligned segment">
          <div className="ui sticky">
            <div className="ui secondary inverted pointing menu">
              <div className="left item">
                <img
                  className="ui mini circular image"
                  src={require('./SWLogo.png')}
                />
                <Link
                  to="/"
                  className={
                    this.state.headerMouseOver === 'home'
                      ? 'active item'
                      : 'item'
                  }
                  onMouseEnter={() => this.onMouseEnter('home')}
                  onMouseLeave={this.onMouseLeave}
                >
                  Home
                </Link>

                <Link
                  to="#"
                  className={
                    this.state.headerMouseOver === 'about'
                      ? 'active item'
                      : 'item'
                  }
                  onMouseEnter={() => this.onMouseEnter('about')}
                  onMouseLeave={this.onMouseLeave}
                >
                  About
                </Link>
              </div>
              {this.state.isAuthenticated
                ? this.renderAfterLogin()
                : this.renderBeforeLogin()}
              {this.state.isAuthenticated && <div>{this.renderLogout()}</div>}
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
          <AuthCard
            onAuthenticated={this.onAuthenticated}
            onCloseAuthCard={this.onCloseAuthCard}
          />
        )}
        <div>
          {this.state.showProfile && (
            <SiderBar
              visible={this.state.showProfile}
              profile={this.state.profile}
              updateState={this.updateState}
              recordRestaurantsListUpdatedStatus={
                recordRestaurantsListUpdatedStatus
              }
              restaurants={restaurants}
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
