import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

import Homepage from './components/homepage/Homepage'
import Customer from './components/Customer'
import Resturant from './components/Resturant'
import Kitchen from './components/Kitchen'
import Waiter from './components/Waiter/Waiter'
import Manager from './components/Manager'
import NotFound from './components/NotFound'
import { getCookie } from './components/authenticate/Cookies'
import { getRestaurants } from './components/apis/actions/restaurants'

class App extends React.Component {
  //I think reason is when using a tag, it freshes when hitting the page url, so state got freshed back to init
  //prolem is I used a tag in Myprofile
  state = {
    restaurants: [],
  }

  fetchRestaurants = restaurants => {
    if (restaurants !== undefined && restaurants.length > 0)
      this.setState({ restaurants: restaurants })
  }

  renderRestaurantRoutes = () => {
    if (this.state.restaurants.length > 0) {
      return this.state.restaurants.map(({ _id, name, description }) => (
        <div key={_id}>
          <Route exact path={'/restaurants/' + _id}>
            <Resturant
              details={{
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
          <Homepage fetchRestaurants={this.fetchRestaurants} />
        </Route>
        {this.renderRestaurantRoutes()}
        <Route path="/not-found" component={NotFound} />
        <Redirect to="/"></Redirect>
      </Switch>
    )
  }
}

export default App
