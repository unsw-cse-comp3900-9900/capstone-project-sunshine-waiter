import React from "react";
import { Route, Redirect, Switch } from "react-router";

import DevNav from "./components/DevNav";
import Customer from "./components/Customer";
import Resturant from "./components/Resturant";
import Kitchen from "./components/Kitchen";
import Waiter from "./components/Waiter";
import Manager from "./components/Manager";
import NotFound from "./components/NotFound";

const App = () => {
  return (
    <div className="ui container">
      <h2>Sunshine Waiter Dev navigationbar</h2>
      <DevNav />

      <Switch>
        <Route exact path="/">
          <Resturant />
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
        <Route exact path="/customer">
          <Customer />
        </Route>

        <Route path="/not-found" component={NotFound} />
        <Redirect to="/not-found"></Redirect>
      </Switch>
    </div>
  );
};

export default App;
