import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

import Homepage from './components/homepage/Homepage'
import Customer from './components/customer/Customer'
import Resturant from './components/Resturant'
import Kitchen from './components/Kitchen/Kitchen'
import Waiter from './components/Waiter/Waiter'
import Manager from './components/manager/Manager'
import NotFound from './components/NotFound'

class App extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" children={<Homepage />} />
        <Route
          exact
          path="/restaurants/:id"
          render={props => <Resturant {...props} />}
        />
        <Route
          exact
          path="/restaurants/:id/waiter"
          children={props => <Waiter {...props} />}
        />
        <Route
          exact
          path="/restaurants/:id/cook"
          children={props => <Kitchen {...props} />}
        />
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
