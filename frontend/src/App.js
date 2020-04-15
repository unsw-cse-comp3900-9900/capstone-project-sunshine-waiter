import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

import Homepage from './components/homepage/Homepage'
import Customer from './components/customer/Customer'
import Resturant from './components/Resturant'
import Kitchen from './components/Kitchen/Kitchen'
import Waiter from './components/Waiter/Waiter'
import Manager from './components/manager/Manager'
import NotFound from './components/NotFound'
import { getRestaurants } from './components/apis/actions/restaurants'
import { getCookie } from './components/authenticate/Cookies'
import { Polling } from './components/apis/Polling'
import { compareTwoArrays } from './components/services'

class App extends React.Component {
  //I think reason is when using a tag, it freshes when hitting the page url, so state got freshed back to init
  //prolem is I used a tag in Myprofile
  state = {
    restaurants: [],
  }

  updateRestaurants = (restaurants = []) => {
    if (
      !compareTwoArrays(restaurants, this.state.restaurants) ||
      !compareTwoArrays(this.state.restaurants, restaurants)
    ) {
      this.setState({
        restaurants: restaurants,
      })
    }
  }

  componentDidMount = () => {
    Polling(
      () => getRestaurants(getCookie('token'), this.updateRestaurants),
      1000
    )
  }

  render() {
    return (
      <Switch>
        <Route
          exact
          path="/"
          children={<Homepage restaurants={this.state.restaurants} />}
        />
        <Route
          exact
          path="/restaurants/:id"
          render={props => <Resturant {...props} />}
        />
        <Route exact path="/restaurants/:id/waiter" children={<Waiter />} />
        <Route exact path="/restaurants/:id/cook" children={<Kitchen />} />
        <Route
          exact
          path="/restaurants/:id/manager"
          render={props => <Manager {...props} />}
        />
        <Route
          exact
          path="/restaurants/:id/cashier"
          children={<div>cashier</div>}
        />
        <Route exact path="/restaurants/:id/customer" children={<Customer />} />
        <Route path="/not-found" component={NotFound} />
        <Redirect to="/"></Redirect>
      </Switch>
    )
  }
}

export default App
