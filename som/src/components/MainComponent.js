import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import Sidebar from './SidebarComponent';
import Database from './DatabaseComponent';
import Visualisation from './VisualisationComponent';
import SOMModel from './ModelComponent';
import DetailedDataset from './DetailedDatasetComponent';

import { DATASET } from '../database/datasetFile';

class Main extends Component {
    constructor(props) {
        super(props);
        const datasetFiles = require('../database-json/datasetFile-files.json');
        const iris = require('../database-json/iris.json');
        // MainComponent is the entry of all data from our database
        // corresponding data will be passed to sub-components through Main
        // MainComponent是所有数据的入口
        this.state = {
            datasets: DATASET,
            datasetsJson: datasetFiles.datasetFile,
            detailedData: iris
        };
        console.log(datasetFiles);
    }



    render() {
        const DatasetWithName = ({match}) => {
            {/** TODO-Backend: get the id of the selcetd dataset file from the backend
                <DetailedDataset dataset={this.state.datasetsJson.filter(dataset =>
                dataset.name === match.params.name)[0]}/> */}
            return (
                <DetailedDataset detailedData={this.state.detailedData}/>
            );
        };

        return (
            <Row>
                <Col className="sidebar" md="3"><Sidebar /></Col>
                <Col className="main-page">
                    <Switch>
                        
                        <Route exact path="/mydatabase" component={() =>
                            <Database datasetfile={this.state.datasetsJson} value={this.state.datasetsJson}/>} 
                        />
                        <Route path='/mydatabase/:datasetName' component={DatasetWithName} />
                        <Route path="/mymodels" component={SOMModel} />
                        <Route path="/visualisation" component={Visualisation} />
                    </Switch>
                </Col>
            </Row>

        );
    }
}

export default Main;