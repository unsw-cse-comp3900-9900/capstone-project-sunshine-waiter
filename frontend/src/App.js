import React from "react";
import { Link } from "react-router-dom";
import { Route, Redirect, Switch } from "react-router";

import Customer from "./components/Customer";
import Waiter from "./components/Waiter";
import Kitchen from "./components/Kitchen";
import Manager from "./components/Manager";
import NotFound from "./components/NotFound";

const App = () => {
  return (
    <div className="ui container">
      <h1>Welcome to Sunshine Waiter!</h1>

      <Switch>
        <Route exact path="/">
          <Customer />
        </Route>
        <Route exact path="/waiter">
          <Waiter />
        </Route>
        <Route exact path="/kitchen">
          <Kitchen />
        </Route>
        <Route exact path="/manager">
          <Manager />
        </Route>
        <Route path="/not-found" component={NotFound} />
        <Redirect to="/not-found"></Redirect>
      </Switch>
    </div>
  );
};

export default App;
