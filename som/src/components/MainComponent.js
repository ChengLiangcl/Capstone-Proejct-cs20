import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import Sidebar from './SidebarComponent';
import Database from './DatabaseComponent';
import Visualisation from './VisualisationComponent';
import SOMModel from './ModelComponent';
import DetailedDataset from './DetailedDatasetComponent';
import MetadataForm from './MetadataForm';

import { fetchDatasetFiles, uploadDataset, fetchUploadedDataset} from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        datasetFiles: state.datasetFiles,
    }
  }

const mapDispatchToProps = dispatch => ({
    fetchDatasetFiles: () => { dispatch(fetchDatasetFiles())},
    uploadDataset: (dataset, onUploadProgress) => dispatch(uploadDataset(dataset, onUploadProgress)),
    fetchUploadedDataset: () => { dispatch(fetchUploadedDataset())}
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

        const DatasetSelect = ({match}) => {      
            return (
            <MetadataForm dataset={this.props.datasetFiles.datasetFiles.filter(dataset => dataset.FileName === match.params.datasetName)[0]}/>
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
                                        fetchUploadedDataset = {this.props.fetchUploadedDataset}
                        />
                        <Route path='/mydatabase/:datasetName' component={DatasetWithName} />
                        <Route path="/metadata-form/:datasetName" component={DatasetSelect}/>
                        <Route path="/mymodels" component={SOMModel} />
                        <Route path="/visualisation" component={Visualisation} />
                        <Redirect to="/mydatabase"/>
                    </Switch>
                </Col>
            </Row>

        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));