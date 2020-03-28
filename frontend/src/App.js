import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

import Homepage from './components/homepage/Homepage'
import Customer from './components/Customer'
import Resturant from './components/Resturant'
import Kitchen from './components/Kitchen'
import Waiter from './components/Waiter/Waiter'
import Manager from './components/Manager'
import NotFound from './components/NotFound'

class App extends React.Component {
  state = {
    restaurants: [
      {
        _id: '1',
        name: 'test',
        description: 'test',
      },
    ],
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
  }

  render() {
    return (
      <Switch>
        <Route exact path="/">
          <Homepage fetchRestaurants={this.fetchRestaurants} />
        </Route>
        {this.renderRestaurantRoutes()}
        <Route path="/not-found" component={NotFound} />
        <Redirect to="/not-found"></Redirect>
      </Switch>
    )
  }
}

export default App
