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


class Database extends Component {
    constructor(props) {
        super(props);
    }

    // to create a flexible table head, where the number of columns depends on the attributes in the datafile.
    // dataset: array. JSON data stored inside.
    tableHead(dataset) {
        if (dataset !== undefined) {
            return (
                <thead>
                    <tr>
                        {Object.keys(dataset[0]).map(element =>
                            <th key={element}>{element}</th>
                        )}
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
    tableBody(dataset) {
        const icon = ["add only", "no add", "all"];
        // when there is no uploaded dataset in the database
        if (dataset.length === 1 && Object.values(dataset[0]).every(element => element === null)) {
            return (
                <tbody>
                    {dataset.map(file =>
                        <tr key={"file"}>
                            {Object.keys(file).map(() => <td key={"empty"}></td>)}
                            <td key={"operate"}>{this.operateDataset(false)}</td>
                        </tr>
                    )}
                </tbody>
            );
        }
        else { // where are dataset stored in the database
            return (
                <tbody> 
                    {dataset.map(file =>
                        <tr key={"eachDataset"}>
                            {Object.values(file).map(eachDataset => <td key={Object.values(eachDataset)[0]}>{eachDataset}</td>)}
                            <td key={"operateEachDataset"}>{this.operateDataset(true, file.name)}</td>
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

                        <IconButton aria-label="create matadata" component="span">
                            <CreateIcon />
                        </IconButton>

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

    fileTable(dataset) {

        return (
            <Table hover>
                {this.tableHead(dataset)}
                {this.tableBody(dataset)}
            </Table>
        );
    }

    render() {
        return (
            <Container>
                <Row className="search-box" >
                <DatasetUpload addDataset={this.props.datasetfile} />
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
                    {this.fileTable(this.props.datasetfile)}
                </Col>
            </Container>
        );
    }
}

export default Database;