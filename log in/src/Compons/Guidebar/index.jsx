import React, { Component } from "react";
import { Link, NavLink} from 'react-router-dom';


export default class guidebar extends Component {
    render() {
        return(
            <div>
               <nav className="navbar navbar-expand-lg navbar-light bg-light">
                
                <Link className="navbar-brand" to="/Home">SOM</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>

              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">

                  <li className="nav-item active">
                    <NavLink className="nav-link" to="/SignUp">Sign up <span className="sr-only">(current)</span></NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink className="nav-link" to="/SignIn">Sign in</NavLink>
                  </li>

                </ul>
              </div>
            </nav>
          </div>
        )
    }
}