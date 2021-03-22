import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
//guidebar

import Guidebar from './Compons/Guidebar/index';
//HomePage
import Home from './Compons/Home/index';
//login
import Signin from './Compons/SignIn/index';
//register
import Signup from './Compons/SignUp/index';

export default class App extends Component{
  render() {
    return (
      
      <Router>
        <Guidebar/>
        <Switch>
          <Route path="/Home" component={Home} />
          <Route path="/SignIn" component={Signin} />
          <Route path="/SignUp" component={Signup} />
        </Switch>

      </Router>
      
    );
  }
}