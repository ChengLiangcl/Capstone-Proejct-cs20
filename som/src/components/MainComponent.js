import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import Sidebar from './SidebarComponent';
import Database from './DatabaseComponent';
import Model from './ModelComponent';
import Visualisation from './VisualisationComponent';
import SOMModel from './ModelComponent';

import { DATASET } from '../database/datasetFile';

class Main extends Component {
    constructor(props){
        super(props);

        // MainComponent is the entry of all data from our database
        // corresponding data will be passed to sub-components through Main
        // MainComponent是所有数据的入口
        this.state = {
            datasets: DATASET
        };
    }

    render(){

        return(
            <Row>
                <Col className="sidebar" md="3"><Sidebar/></Col>
                <Col className="main-page">
                    <Switch>
                        <Route path="/mydatabase" component={() => 
                            <Database datasetfile={this.state.datasets}/>}/>
                        <Route path="/mymodels" component={SOMModel}/>
                        <Route path="/visualisation" component={Visualisation}/>
                    </Switch>
                </Col>
            </Row>
                
            
            
        );
    }
}

export default Main;