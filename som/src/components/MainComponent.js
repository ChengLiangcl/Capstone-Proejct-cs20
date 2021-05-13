import React, {PureComponent, Component, useCallback} from 'react';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Container, Row, Col} from 'reactstrap';
import {actions} from 'react-redux-form';
import Sidebar from './SidebarComponent';
import Database from './DatabaseComponent';
import AllDataset from './AlldatasetsComponent';
import Visualisation from './VisualisationComponent';
import SOMModel from './ModelComponent';
import DetailedDataset from './DetailedDatasetComponent';
import MetadataForm from './MetadataForm';

import compareProps from '../others/compareProps';

import {
  fetchDatasetFiles, uploadDataset, fetchUploadedDataset, submitMetadata, deleteOneDataset,
  sendNameForDetailedData, queryDatasets,
  fetchAllDatasetFiles,queryAllDatasets
} from '../redux/ActionCreators';

const mapStateToProps = state => {
  return {
    metadata: state.metadata,
    datasetFiles: state.datasetFiles,
    allDatasetFiles: state.allDatasetFiles,
    detailedData: state.detailedData
  }
}

const mapDispatchToProps = dispatch => ({
  fetchDatasetFiles: () => {
    dispatch(fetchDatasetFiles())
  },
  uploadDataset: (dataset, onUploadProgress) => dispatch(uploadDataset(dataset, onUploadProgress)),
  fetchUploadedDataset: () => {
    dispatch(fetchUploadedDataset())
  },
  deleteDataset: (datasetName) => {
    dispatch(deleteOneDataset(datasetName))
  },
  submitMetadata: (metadata) => {
    dispatch(submitMetadata(metadata))
  },
  sendNameForDetailedData: (datasetName) => {
    dispatch(sendNameForDetailedData(datasetName))
  },
  queryDatasets: (inputValue) => {
    dispatch(queryDatasets(inputValue))
  },
  fetchAllDatasetFiles: (inputValue) => {
    dispatch(fetchAllDatasetFiles(inputValue))
  },
  queryAllDatasets: (inputValue) => {
    dispatch(queryAllDatasets(inputValue))
  },
  resetMetadata: () => {
    dispatch(actions.reset('initialMetadata'))
  }
});

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDataset: ''
    }
  }


  componentDidMount() {
    console.log("start mount");
    this.props.fetchDatasetFiles();
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("start should");
    // if the metadata itself needs to be updated, return true
    console.log("compareMetadata: ", this.props.metadata.metadata);
    console.log("nextMetadata: ", nextProps.metadata.metadata);
    if (compareProps(this.props.metadata.metadata[0], nextProps.metadata.metadata[0])) {
      console.log("because of metadata");
      return true
    } else {
      if (this.props.datasetFiles.datasetFiles !== nextProps.datasetFiles.datasetFiles||this.props.allDatasetFiles.datasetFiles !== nextProps.allDatasetFiles.datasetFiles) {
        console.log("because of dataset files");
        return true;
      } else {
        console.log("not update");
        return false;
      }
    }
  }

  render() {
    const DatasetWithName = ({match}) => {
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
          errMess_metadata={this.props.metadata.errMess}/>
      );
    };

    const DatasetSelect = ({match}) => {
      let datasetName = this.props.datasetFiles.datasetFiles.filter(dataset => dataset.FileName === match.params.datasetName)[0] == undefined ? localStorage.getItem('datasetname-metadata') :
        this.props.datasetFiles.datasetFiles.filter(dataset => dataset.FileName === match.params.datasetName)[0].FileName;
      console.log("dataset name: ", datasetName);
      localStorage.setItem('datasetname-metadata', datasetName);

      return (
        <MetadataForm
          dataset={this.props.datasetFiles.datasetFiles.filter(dataset => dataset.FileName === match.params.datasetName)[0]}
          submitMetadata={this.props.submitMetadata}
          fetchDatasetFiles={this.props.fetchDatasetFiles}
          sendNameForDetailedData={this.props.sendNameForDetailedData}
          metadata={this.props.metadata.metadata[0]}
        />
      );
    };


    return (
      <Row>
        <Col className="sidebar" md="3"><Sidebar/></Col>
        <Col className="main-page">
          <Switch>

            <Route exact path="/mydatabase" component={() =>
              <Database datasetFiles={this.props.datasetFiles.datasetFiles}
                        isLoading={this.props.datasetFiles.isLoading}
                        errMess={this.props.datasetFiles.errMess}
                        uploadDataset={this.props.uploadDataset}
                        fetchUploadedDataset={this.props.fetchUploadedDataset}
                        deleteDataset={this.props.deleteDataset}
                        fetchDatasetFiles={this.props.fetchDatasetFiles}
                        queryDatasets={this.props.queryDatasets}
              />}/>
            <Route path='/mydatabase/:datasetName' component={DatasetWithName}/>
            <Route path="/metadata-form/:datasetName" component={DatasetSelect}/>
            <Route path="/mymodels" component={SOMModel}/>
            <Route path="/visualisation" component={Visualisation}/>
            <Route exact path="/alldataset" component={() =>
              <AllDataset datasetFiles={this.props.allDatasetFiles.datasetFiles}
                           isLoading={this.props.allDatasetFiles.isLoading}
                           errMess={this.props.allDatasetFiles.errMess}
                           fetchDatasetFiles={this.props.fetchAllDatasetFiles}
                           queryDatasets={this.props.queryAllDatasets}
              />}/>
            <Redirect to="/mydatabase"/>
          </Switch>
        </Col>
      </Row>

    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
