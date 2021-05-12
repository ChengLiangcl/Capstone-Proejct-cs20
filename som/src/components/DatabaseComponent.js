import React, { Component } from 'react';
import { Card, CardBody } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Table } from 'reactstrap';
import { IconButton, Modal, TableRow } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import ModelBinding from './Modal/BindModel';
import TableChartIcon from '@material-ui/icons/TableChart';
import { Link } from 'react-router-dom';

import DatasetUpload from './DatasetUploadComponent';
import DeleteOneDataset from './DeleteOneDataset';
import { Loading } from './LoadingComponent';
import MetadataForm from './MetadataForm';
import SearchFile from './searchFileComponent';

class Database extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShown: false
        };
    }

    componentDidUpdate() {
        this.props.fetchDatasetFiles(sessionStorage.getItem('verifiedUsername'));
    }

    // to create a flexible table head, where the number of columns depends on the attributes in the datafile.
    // dataset: array. JSON data stored inside.
    tableHead(datasets) {
        if (datasets !== undefined) {
            return (
                <thead>
                    <tr>
                        <th width="10%">File name</th>
                        <th width="18%">Description</th>
                        <th width="8%">Size</th>
                        <th width="10%">Operation</th>
                    </tr>
                </thead>
            );
        }

        return (
            <div>The table for storing uploaded datasets does not exist</div>
        );
    }

    //TODO: may change if the design of the database is changed
    tableBody(datasets) {
        // when there is no uploaded dataset in the database
        console.log(`dataset length: ${datasets.length}, dataset is ${datasets}`)
        if (datasets.length === 0) {
            return (
                <tbody />
            );
        }
        else { // where are dataset stored in the database
            return (
                <tbody>
                    {datasets.map((eachDataset, index) =>
                        <tr key={index}>
                            <td key={'dataset name'}>{eachDataset.FileName}</td>
                            <td key={'dataset briefInfo'}>{eachDataset.BriefInfo}</td>
                            <td key={'dataset size'}>{eachDataset.Size}</td>
                            <td key={"operateEachDataset"}>{this.operateDataset(true, eachDataset.FileName, eachDataset.ModelName)}</td>
                        </tr>
                    )}
                </tbody>
            );
        }

    }

    //showOperate: bool. the delete button and the create button will be disable
    operateDataset(showOperate, fileName, bindModelName) {
        /** 
        if (icons === "add only") {
            return (
                <Container>
                    <Row>
                        <DatasetUpload addDataset={this.props.datasetfile} />
                    </Row>
                </Container>
            );
        }*/
        if (showOperate) {
            return (
                <Container>
                    <Row>
                        <DeleteOneDataset deleteDataset={this.props.deleteDataset}
                            deletedFileName={fileName} />

                        <Link to={`/metadata-form/${fileName}`}>
                            <IconButton aria-label="create matadata" component="span">
                                <CreateIcon />
                            </IconButton>
                        </Link>

                        <ModelBinding modelFiles={this.props.modelFiles} datasetName={fileName}
                            bindModel={this.props.bindModel} bindedModelName={bindModelName}/>
                    </Row>
                </Container>
            );
        }
    }

    renderDatasetTable(datasets, isLoading, errMess) {
        if (isLoading) {
            return (
                <Loading />
            );
        }
        else if (errMess) {
            return (
                <h4>{errMess}</h4>
            );
        }
        else {
            return (
                <Table hover style={{tableLayout: 'fixed', wordWrap: 'break-word'}}>
                    {this.tableHead(datasets)}
                    {this.tableBody(datasets)}
                </Table>
            );
        }
    }

    render() {
        return (
            <Container>
                <Col className="search-box" >
                    <SearchFile queryDatasets={this.props.queryDatasets} />
                </Col>

                <Col>
                    <DatasetUpload uploadDataset={this.props.uploadDataset} fetchDatasetFiles={this.props.fetchDatasetFiles}/>
                </Col>

                <Col className="database">
                    {this.renderDatasetTable(this.props.datasetFiles, this.props.isLoading, this.props.errMess)}
                </Col>
            </Container>
        );
    }
}

export default Database;