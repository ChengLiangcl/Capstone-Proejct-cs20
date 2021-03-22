import React, { Component } from 'react';
import { InputGroup, InputGroupText, InputGroupAddon, Input } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';
import { Table } from 'reactstrap';
import { IconButton, Modal } from '@material-ui/core';
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
                            <td key={"operate"}>{this.operateDataset("add only")}</td>
                        </tr>
                    )}
                </tbody>
            );
        }
        else { // where are dataset stored in the database
            return (
                <tbody> {/**除倒数第一行外，其他行只显示删除和更新metadata的icon */}
                    {dataset.slice(0, -1).map(file =>

                        <tr key={"eachDataset"}>
                            {Object.values(file).map(filedata => <td key={Object.values(filedata)[0]}>{filedata}</td>)}
                            <td key={"operateEachDataset"}>{this.operateDataset("no add", file.name)}</td>
                        </tr>

                    )}
                    {/**倒数第一行，除了删除和更新，还会显示上传文件按钮 */}
                    <tr key="lastDataset">
                        {Object.values(dataset[dataset.length - 1]).map(filedata => <td key={Object.values(filedata)[0]}>{filedata}</td>)}
                        <td key={"operateLastDataset"}>{this.operateDataset("all", dataset[dataset.length - 1].name)}</td>
                    </tr>
                </tbody>
            );
        }

    }

    //disable: bool. the delete button and the create button will be disable
    operateDataset(icons, name) {
        if (icons === "add only") {
            return (
                <Container>
                    <Row>
                        <DatasetUpload addDataset={this.props.datasetfile} />
                    </Row>
                </Container>
            );
        }
        else if (icons === "no add") {
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
        else if (icons === "all") {
            return (
                <Container>
                    <Row>

                        <DatasetUpload addDataset={this.props.datasetfile} />

                        {/**把要删除的dataset的key或id传给后端，然后从数据库拿更新好的数据，最后更新界面 */}
                        <label>
                            <IconButton aria-label="delete a dataset" component="span">
                                <DeleteIcon />
                            </IconButton>
                        </label>

                        <label>
                            <IconButton aria-label="create matadata" component="span">
                                <CreateIcon />
                            </IconButton>
                        </label>

                        <label>
                            <Link to={`/mydatabase/${name}`}>
                                <IconButton aria-label="create matadata" component="span">
                                    <TableChartIcon />
                                </IconButton>
                            </Link>
                        </label>
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
                <Col className="search-box" >
                    <Col md={{ size: 7 }}>
                        <InputGroup style={{ width: '6' }} >
                            <Input placeholder="Search similar datasets here" />
                            <InputGroupAddon addonType="append">
                                <Button style={{ backgroundColor: '#378CC6' }}>Search</Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </Col>
                </Col>

                <Col className="database">
                    {this.fileTable(this.props.datasetfile)}
                </Col>
            </Container>
        );
    }
}

export default Database;