import React, { PureComponent, Component, useCallback } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { actions } from 'react-redux-form';
import Sidebar from './SidebarComponent';
import Database from './DatabaseComponent';
import Visualisation from './VisualisationComponent';
import SOMModel from './ModelComponent';
import DetailedDataset from './DetailedDatasetComponent';
import MetadataForm from './MetadataForm';
import ConnectionUploading from './ConnectionUploading';

import compareProps from '../others/compareProps';

import {
    fetchDatasetFiles, uploadDataset, fetchUploadedDataset, submitMetadata, deleteOneDataset, queryDatasets,
    fetchModelFiles, uploadModel, fetchUploadedModel, deleteOneModel, editModelDescription,
    sendNameForDetailedData, connectUploading, clearConnectionFiles
} from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        user: state.user,
        metadata: state.metadata,
        datasetFiles: state.datasetFiles,
        modelFiles: state.modelFiles,
        detailedData: state.detailedData,
        connectionFiles: state.connectionFiles
    }
}

const mapDispatchToProps = dispatch => ({
    connectUploading: (files, onUploadProgress) => dispatch(connectUploading(files, onUploadProgress)),
    clearConnectionFiles: () => dispatch(clearConnectionFiles()),

    fetchDatasetFiles: (userName) => { dispatch(fetchDatasetFiles(userName)) },
    uploadDataset: (dataset, onUploadProgress) => dispatch(uploadDataset(dataset, onUploadProgress)),
    fetchUploadedDataset: () => { dispatch(fetchUploadedDataset()) },
    deleteDataset: (datasetName, userName) => { dispatch(deleteOneDataset(datasetName, userName)) },
    queryDatasets: (inputValue, userName) => { dispatch(queryDatasets(inputValue, userName)) },

    fetchModelFiles: (userName) => { dispatch(fetchModelFiles(userName)) },
    uploadModel: (model, onUploadProgress) => dispatch(uploadModel(model, onUploadProgress)),
    fetchUploadedModel: () => { dispatch(fetchUploadedModel()) },
    deleteModel: (name, userName) => { dispatch(deleteOneModel(name, userName)) },
    editModelDescription: (name, description, username) => { dispatch(editModelDescription(name, description, username)) },

    submitMetadata: (metadata) => { dispatch(submitMetadata(metadata)) },
    sendNameForDetailedData: (datasetName, userName) => { dispatch(sendNameForDetailedData(datasetName, userName)) }
});

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDataset: ''
        }
    }

    componentDidMount() {
        this.props.fetchDatasetFiles(sessionStorage.getItem('verifiedUsername'));
        this.props.fetchModelFiles(sessionStorage.getItem('verifiedUsername'));
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log("start should");
        // if the metadata itself needs to be updated, return true
        //console.log("compareMetadata: ", this.props.metadata.metadata);
        //console.log("nextMetadata: ", nextProps.metadata.metadata);
        if (compareProps(this.props.metadata.metadata[0], nextProps.metadata.metadata[0], this.props.modelFiles.modelFiles, nextProps.modelFiles.modelFiles)) {
            console.log("because of metadata");
            return true
        }
        else {
            if (this.props.datasetFiles.datasetFiles !== nextProps.datasetFiles.datasetFiles) {
                console.log("because of dataset files");
                return true;
            }
            else if (this.props.connectionFiles.connectionFiles[0] !== nextProps.connectionFiles.connectionFiles[0]){
                console.log("because of connection files");
                return true   
            }
            else {
                console.log("not update");
                return false;
            }
        }
    }

    render() {
        const DatasetWithName = ({ match }) => {
            let selectedDataset = this.props.datasetFiles.datasetFiles.filter(dataset => dataset.FileName === match.params.datasetName)[0] == undefined ? localStorage.getItem('datasetname-detaileddata') :
                this.props.datasetFiles.datasetFiles.filter(dataset => dataset.FileName === match.params.datasetName)[0].FileName;
            localStorage.setItem('datasetname-detaileddata', selectedDataset);
            console.log("detaileddata for name: ", selectedDataset);

            return (
                <DetailedDataset
                    selectedDataset={this.props.datasetFiles.datasetFiles.filter(dataset => dataset.FileName === match.params.datasetName)[0]}
                    sendNameForDetailedData={this.props.sendNameForDetailedData}
                    detailedData={this.props.detailedData.detailedData}
                    isLoading_detailedData={this.props.detailedData.isLoading}
                    errMess_detailedData={this.props.detailedData.errMess}

                    metadata={this.props.metadata.metadata[0]}
                    isLoading_metadata={this.props.metadata.isLoading}
                    errMess_metadata={this.props.metadata.errMess} />
            );
        };

        const DatasetSelect = ({ match }) => {
            let datasetName = this.props.datasetFiles.datasetFiles.filter(dataset => dataset.FileName === match.params.datasetName)[0] == undefined ? localStorage.getItem('datasetname-metadata') :
                this.props.datasetFiles.datasetFiles.filter(dataset => dataset.FileName === match.params.datasetName)[0].FileName;
            console.log("dataset name: ", datasetName);
            localStorage.setItem('datasetname-metadata', datasetName);

            return (
                <MetadataForm dataset={this.props.datasetFiles.datasetFiles.filter(dataset => dataset.FileName === match.params.datasetName)[0]}
                    submitMetadata={this.props.submitMetadata}
                    fetchDatasetFiles={this.props.fetchDatasetFiles}
                    sendNameForDetailedData={this.props.sendNameForDetailedData}
                    metadata={this.props.metadata.metadata[0]}
                />
            );
        };

        return (
            <Row>
                <Col className="sidebar" md="3"><Sidebar username={this.props.user.userInfo} /></Col>
                <Col className="main-page">
                    <Switch>
                        <Route path="/uploading" component={() => 
                            <ConnectionUploading connectUploading={this.props.connectUploading}
                                connectionFiles = {this.props.connectionFiles.connectionFiles}
                                clearConnectionFiles = {this.props.clearConnectionFiles}
                            />}/>

                        <Route exact path="/mydatabase" component={() =>
                            <Database datasetFiles={this.props.datasetFiles.datasetFiles}
                                isLoading={this.props.datasetFiles.isLoading}
                                errMess={this.props.datasetFiles.errMess}
                                uploadDataset={this.props.uploadDataset}
                                fetchUploadedDataset={this.props.fetchUploadedDataset}
                                deleteDataset={this.props.deleteDataset}
                                fetchDatasetFiles={this.props.fetchDatasetFiles}
                                queryDatasets={this.props.queryDatasets}
                            />} />
                        <Route path='/mydatabase/:datasetName' component={DatasetWithName} />
                        <Route path="/metadata-form/:datasetName" component={DatasetSelect} />
                        <Route path="/mymodels" component={() => <SOMModel
                            modelFiles={this.props.modelFiles.modelFiles}
                            isLoading={this.props.modelFiles.isLoading}
                            errMess={this.props.modelFiles.errMess}
                            uploadModel={this.props.uploadModel}
                            fetchUploadedModel={this.props.fetchUploadedModel}
                            deleteModel={this.props.deleteModel}
                            editModelDescription={this.props.editModelDescription}
                            fetchModelFiles={this.props.fetchModelFiles}
                        />} />
                        <Route path="/visualisation" component={Visualisation} />
                        <Redirect to="/mydatabase" />
                    </Switch>
                </Col>
            </Row>

        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
