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

import {
    fetchDatasetFiles, uploadDataset, fetchUploadedDataset, submitMetadata, deleteOneDataset,
    fetchModelFiles, uploadModel, fetchUploadedModel, deleteOneModel,editModelDescription,
    sendNameForDetailedData
} from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        user: state.user,
        metadata: state.metadata,
        datasetFiles: state.datasetFiles,
        modelFiles: state.modelFiles,
        detailedData: state.detailedData
    }
}

const mapDispatchToProps = dispatch => ({
    fetchDatasetFiles: () => { dispatch(fetchDatasetFiles()) },
    uploadDataset: (dataset, onUploadProgress) => dispatch(uploadDataset(dataset, onUploadProgress)),
    fetchUploadedDataset: () => { dispatch(fetchUploadedDataset()) },
    deleteDataset: (datasetName) => { dispatch(deleteOneDataset(datasetName)) },
    fetchModelFiles: () => { dispatch(fetchModelFiles()) },
    uploadModel: (model, onUploadProgress) => dispatch(uploadModel(model, onUploadProgress)),
    fetchUploadedModel: () => { dispatch(fetchUploadedModel()) },
    deleteModel: (name) => { dispatch(deleteOneModel(name)) },
  editModelDescription: (name,description) => { dispatch(editModelDescription(name,description)) },
    submitMetadata: (metadata) => { dispatch(submitMetadata(metadata)) },
    sendNameForDetailedData: (datasetName) => { dispatch(sendNameForDetailedData(datasetName)) }
});

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDataset: ''
        }
    }

    componentDidMount() {
        this.props.fetchDatasetFiles();
        this.props.fetchModelFiles();
    }

    shouldComponentUpdate(nextProps, nextState) {
        /** 
      if (this.props.modelFiles.modelFiles !== nextProps.modelFiles.modelFiles){
        return true
      }*/
        console.log("start update")
        if (this.props.metadata.metadata.length === nextProps.metadata.metadata.length){
            if (this.props.datasetFiles.datasetFiles !== nextProps.datasetFiles.datasetFiles){
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    }

    render() {
        const DatasetWithName = ({ match }) => {

            return (
                <DetailedDataset
                    selectedDataset= {this.props.datasetFiles.datasetFiles.filter(dataset => dataset.FileName === match.params.datasetName)[0]}
                    sendNameForDetailedData = {this.props.sendNameForDetailedData}
                    detailedData={this.props.detailedData.detailedData}
                    isLoading_detailedData={this.props.detailedData.isLoading}
                    errMess_detailedData={this.props.detailedData.errMess}

                    metadata={this.props.metadata.metadata}
                    isLoading_metadata={this.props.metadata.isLoading}
                    errMess_metadata={this.props.metadata.errMess}  />
            );
        };

        const DatasetSelect = ({ match }) => {
            return (
                <MetadataForm dataset={this.props.datasetFiles.datasetFiles.filter(dataset => dataset.FileName === match.params.datasetName)[0]}
                    submitMetadata={this.props.submitMetadata}
                />
            );
        };

        return (
            <Row>
                <Col className="sidebar" md="3"><Sidebar username={this.props.user.userInfo}/></Col>
                <Col className="main-page">
                    <Switch>

                        <Route exact path="/mydatabase" component={() =>
                            <Database datasetFiles={this.props.datasetFiles.datasetFiles}
                                isLoading={this.props.datasetFiles.isLoading}
                                errMess={this.props.datasetFiles.errMess}
                                uploadDataset={this.props.uploadDataset}
                                fetchUploadedDataset={this.props.fetchUploadedDataset}
                                deleteDataset={this.props.deleteDataset}
                            />} />
                        <Route path='/mydatabase/:datasetName' component={DatasetWithName} />
                        <Route path="/metadata-form/:datasetName" component={DatasetSelect} />
                        <Route path="/mymodels" component={()=><SOMModel
                          modelFiles={this.props.modelFiles.modelFiles}
                          isLoading={this.props.modelFiles.isLoading}
                          errMess={this.props.modelFiles.errMess}
                          uploadModel={this.props.uploadModel}
                          fetchUploadedModel={this.props.fetchUploadedModel}
                          deleteModel={this.props.deleteModel}
                          editModelDescription={this.props.editModelDescription}
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
