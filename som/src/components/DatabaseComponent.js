import React, { Component } from 'react';
import { InputGroup, InputGroupText, InputGroupAddon, Input } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';
import { Table } from 'reactstrap';
import { IconButton, Modal, TableRow } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import TableChartIcon from '@material-ui/icons/TableChart';
import { Link } from 'react-router-dom';

import DatasetUpload from './DatasetUploadComponent';
import MetadataForm from './MetadataForm';
import { Loading } from './LoadingComponent';


class Database extends Component {
    constructor(props) {
        super(props);
    }

    // to create a flexible table head, where the number of columns depends on the attributes in the datafile.
    // dataset: array. JSON data stored inside.
    tableHead(datasets) {
        if (datasets !== undefined) {
            return (
                <thead>
                    <tr>
                        <th>File name</th>
                        <th>Description</th>
                        <th>Size</th>
                        <th>Operation</th>
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
                            {Object.values(eachDataset).slice(1, eachDataset.length).map(eachValue => <td key={Object.values(eachValue)[0]}>{eachValue}</td>)}
                            <td key={"operateEachDataset"}>{this.operateDataset(true, eachDataset.FileName)}</td>
                        </tr>
                    )}
                </tbody>
            );
        }

    }

    //showOperate: bool. the delete button and the create button will be disable
    operateDataset(showOperate, name) {
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
                        <IconButton aria-label="delete a dataset" component="span">
                            <DeleteIcon />
                        </IconButton>

                        <Link to={`/metadata-form/${name}`}>
                            <IconButton aria-label="create matadata" component="span">
                                <CreateIcon />
                            </IconButton>
                        </Link>

                        <Link to={`/mydatabase/${name}`}>
                            <IconButton aria-label="create matadata" component="span">
                                <TableChartIcon />
                            </IconButton>
                        </Link>
                    </Row>
                </Container>
            );
        }
    }

    renderDatasetTable(datasets, isLoading, errMess) {
        if (isLoading) {
            return(
                <Loading />
            );
        }
        else if (errMess) {
            return(
                <h4>{errMess}</h4>
            );
        }
        else {
            return (
                <Table hover>
                    {this.tableHead(datasets)}
                    {this.tableBody(datasets)}
                </Table>
            );
        } 
    }

    render() {
        return (
            <Container>
                <Row className="search-box" >
                <DatasetUpload addDataset={this.props.uploadDataset} />
                    <Col md={{ size: 7 }}>
                        <InputGroup style={{ width: '6' }} >
                            <Input placeholder="Search similar datasets here" />
                            <InputGroupAddon addonType="append">
                                <Button style={{ backgroundColor: '#378CC6' }}>Search</Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </Col>
                </Row>

                <Col className="database">
                    {this.renderDatasetTable(this.props.datasetFiles, this.props.isLoading, this.props.errMess)}
                </Col>
            </Container>
        );
    }
}

export default Database;