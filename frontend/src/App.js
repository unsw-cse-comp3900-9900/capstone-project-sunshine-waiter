import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

import Customer from './components/customer/Customer'

import Homepage from './components/homepage/Homepage'

import Resturant from './components/Resturant'
import Kitchen from './components/Kitchen/Kitchen'
import Waiter from './components/Waiter/Waiter'
import Manager from './components/Manager'
import NotFound from './components/NotFound'
import { getCookie } from './components/authenticate/Cookies'
import { getRestaurants } from './components/apis/actions/restaurants'

class App extends React.Component {
  //I think reason is when using a tag, it freshes when hitting the page url, so state got freshed back to init
  //prolem is I used a tag in Myprofile
  state = {
    //true or false of the value does not matter, just to record it updated
    //and then can trigger the ComponentDidUpdate
    restaurantsListUpdated: false,
    restaurants: [],
  }

  updateRestaurants = (restaurants = []) => {
    this.setState({
      restaurants: restaurants,
    })
  }

  recordRestaurantsListUpdatedStatus = () => {
    console.log('touched!')
    this.setState({
      restaurantsListUpdated: !this.state.restaurantsListUpdated,
    })
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevState.restaurantsListUpdated !== this.state.restaurantsListUpdated
    ) {
      getRestaurants(getCookie('token'), this.updateRestaurants)
    }
  }

  renderRestaurantRoutes = () => {
    if (this.state.restaurants.length > 0) {
      return this.state.restaurants.map(({ _id, name, description }) => (
        <div key={_id}>
          <Route exact path={'/restaurants/' + _id}>
            <Resturant
              details={{
                _id: _id,
                name: name,
                description: description,
              }}
            />
          </Route>
          <Route exact path={'/restaurants/' + _id + '/waiter'}>
            <Waiter />
          </Route>
          <Route exact path={'/restaurants/' + _id + '/cook'}>
            <Kitchen />
          </Route>
          <Route exact path={'/restaurants/' + _id + '/manager'}>
            <Manager />
          </Route>
          <Route exact path={'/restaurants/' + _id + '/cashier'}>
            <div>cashier</div>
          </Route>
          <Route exact path={'/restaurants/' + _id + '/customer'}>
            <Customer />
          </Route>
        </div>
      ))
    }
    return null
  }

  render() {
    return (
      <Switch>
        <Route exact path="/">
          <Homepage
            recordRestaurantsListUpdatedStatus={
              this.recordRestaurantsListUpdatedStatus
            }
            restaurants={this.state.restaurants}
          />
        </Route>
        {this.renderRestaurantRoutes()}
        <Route path="/not-found" component={NotFound} />
        <Redirect to="/"></Redirect>
      </Switch>
    )
  }
}

export default App
