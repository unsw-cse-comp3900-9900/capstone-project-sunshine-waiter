import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

import Homepage from './components/homepage/Homepage'
import Customer from './components/Customer'
import Resturant from './components/Resturant'
import Kitchen from './components/Kitchen'
import Waiter from './components/Waiter/Waiter'
import Manager from './components/Manager'
import NotFound from './components/NotFound'

const App = () => {
  return (
    <div className="ui contanier">
      <Switch>
        <Route exact path="/">
          <Homepage />
        </Route>
        <Route exact path="/restaurants/1">
          <Resturant />
        </Route>
        <Route exact path="/restaurants/1/waiter">
          <Waiter />
        </Route>
        <Route exact path="/restaurants/1/cook">
          <Kitchen />
        </Route>
        <Route exact path="/restaurants/1/manager">
          <Manager />
        </Route>
        <Route exact path="/restaurants/1/cashier">
          <div>cashier</div>
        </Route>
        <Route exact path="/restaurants/1/customer">
          <Customer />
        </Route>

        <Route path="/not-found" component={NotFound} />
        <Redirect to="/not-found"></Redirect>
      </Switch>
    </div>
  )
}

export default App
