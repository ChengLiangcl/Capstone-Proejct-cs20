import React, { Component} from 'react';
import { InputGroup, InputGroupText, InputGroupAddon, Input } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';
import { Table } from 'reactstrap';
import { IconButton, Modal } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';

import DatasetUpload from './DatasetUploadComponent';

class Database extends Component {
    constructor(props){
        super(props);
  
    }

    // React API, used to update the whole DatabaseComponent when the data changed in the datasetfile
    
    componentDidMount(){
       this.render();
    }




    // to create a flexible table head, where the number of columns depends on the attributes in the datafile.
    // dataset: array. JSON data stored inside.
    tableHead(dataset){
        if (dataset !== undefined){
            return(
                    <thead>
                        <tr>
                            {Object.keys(dataset[0]).map(element =>
                                <th>{element}</th>
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
    tableBody(dataset){
        // when there is no uploaded dataset in the database
        if (dataset.length === 1 && Object.values(dataset[0]).every(element => element === null)){
            return (
                    <tbody>
                        {dataset.map(file => 
                            <tr>
                                {Object.keys(file).map(() => <td></td>)}
                                <td>{this.operateDataset(true)}</td>
                            </tr>
                        )}
                </tbody>
            );
        } 
        else {
            return(
                    <tbody>
                        {dataset.map(file => 
                            <tr>
                                {Object.values(file).map(filedata =><td>{filedata}</td>)}
                                <td>{this.operateDataset(false)}</td>
                            </tr>
                        )}
                </tbody>
            );
        }
        
    }

    //disable: bool. the delete button and the create button will be disable
    operateDataset(disable){
        if (disable){
            return(
                <Container>
                    <Row>
                        <DatasetUpload addDataset={this.props.datasetfile}/>
                    </Row>
                </Container>
            );
        }

        return(
            <Container>
                <Row>
                    <IconButton aria-label="add a dataset">
                        <DatasetUpload addDataset={this.props.datasetfile}/>
                    </IconButton>

                    <IconButton aria-label="delete a dataset">
                        <DeleteIcon addonType/>
                    </IconButton>

                    <IconButton aria-label="create matadata">
                        <CreateIcon />
                    </IconButton>
                </Row>
            </Container>
        );
    }

    fileTable(dataset){

        return (
            <Table hover>
                {this.tableHead(dataset)}
                {this.tableBody(dataset)}
            </Table>
        );
    }

    render(){
        return(
            <Container>
                <Col className="search-box" >
                    <Col md={{size: 7}}>
                        <InputGroup style={{width: '6'}} >
                            <Input placeholder="Search similar datasets here"/>
                            <InputGroupAddon addonType="append">
                                <Button style={{backgroundColor: '#378CC6'}}>Search</Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </Col>
                </Col>

                <Col className="database">
                    {this.fileTable(this.props.datasetfile)}
                    <div>{JSON.stringify(this.props.datasetfile)}</div>
                </Col>
            </Container>
        );
    }
}

export default Database;