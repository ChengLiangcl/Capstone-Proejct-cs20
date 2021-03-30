import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import Sidebar from './SidebarComponent';
import Database from './DatabaseComponent';
import Visualisation from './VisualisationComponent';
import SOMModel from './ModelComponent';
import DetailedDataset from './DetailedDatasetComponent';

import { fetchDatasetFiles, uploadDataset } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        datasetFiles: state.datasetFiles,
    }
  }

const mapDispatchToProps = dispatch => ({
    fetchDatasetFiles: () => { dispatch(fetchDatasetFiles())},
    uploadDataset: (dataset) => dispatch(uploadDataset(dataset))

});

class Main extends Component {
    constructor(props) {
        super(props);
        const iris = require('../database-json/iris.json');
        this.state = {
            detailedData: iris,
        };
    }

    componentDidMount() {
        this.props.fetchDatasetFiles();
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
                            <Database datasetFiles={this.props.datasetFiles.datasetFiles} 
                                        isLoading = { this.props.datasetFiles.isLoading}
                                        errMess = { this.props.datasetFiles.errMess}
                                        uploadDataset = {this.props.uploadDataset}/>}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));