import React, { Component } from 'react';
import { Card, CardImg, Media } from 'reactstrap';
import { Container } from 'reactstrap';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Link, NavLink } from 'react-router-dom';


function Sidebar(props){

    return (
        <div className="col col-md">
            <div className="side-group">
                <ListGroup className="side-items" flush>
                    <Media className="logo" src={'/assets/logo.png'} alt={'som log'}/>

                    <ListGroupItem action>
                        <NavLink className="nav-link" to="/mydatabase">
                            <span className="slide-icon fa fa-database"></span>
                            &nbsp;My database
                        </NavLink>
                    </ListGroupItem>

                    <ListGroupItem action>
                        <NavLink className="nav-link" to="/mymodels">
                            <span className="slide-icon fa fa-cubes"></span>
                            My models
                        </NavLink>
                    </ListGroupItem>
                      
                    <ListGroupItem action>
                        <NavLink className="nav-link" to="/visualisation">
                            <span className="slide-icon fa fa-area-chart"></span>
                            Visualisation
                            </NavLink>
                    </ListGroupItem>

                    <ListGroupItem action>
                        <NavLink className="nav-link" to="/alldataset">
                            <span className="slide-icon fa fa-area-chart"></span>
                                 Alldataset
                            </NavLink>
                    </ListGroupItem>
                           
                </ListGroup>
            </div>
        </div>
    );

}

export default Sidebar;