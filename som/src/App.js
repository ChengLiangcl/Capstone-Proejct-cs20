import './App.css';
import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Main from './components/MainComponent';

import {Provider} from 'react-redux';
import {ConfigureStore} from './redux/configureStore';
import Database from "./components/DatabaseComponent";
import SOMModel from "./components/ModelComponent";
import Visualisation from "./components/VisualisationComponent";
import Login from "./components/LoginComponent";
import Signup from "./components/Signup";
import {Col} from "reactstrap";

const store = ConfigureStore();

class App extends Component{
  
  render(){
    return (
      <Provider store={store}>
        <BrowserRouter>
        <Switch>
            <Route path="/login" component={Login}/>
            <Route path="/" component={()=><div className="APP">
              <Main/>
            </div>}/>
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
