import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import {Table} from 'reactstrap';

function RenderDatasets({datasets}){
    const colName = Object.keys(datasets[Object.keys(datasets)[0]]);
    console.log(colName);
    return (
        <Table striped>
            <thead>
                <tr>
                {colName.map(col =>
                    <th>{col}</th>
                )}
                </tr>
            </thead>
                
            <tbody>
                {Object.keys(datasets).map(row => // [row1, row2, row3, row4, row5]
                    <tr>
                        {Object.values(datasets[row]).map(value =>
                            <td>{value}</td>
                        )}
                    </tr>
                )}
            </tbody>
        </Table>
    );
}

function DetailedDataset(props) {
    return (
        <Container>
            <Col className="detailed-metadata" >
                <Col md={{ size: 7 }}>
                    <div>There wil be a metadata information shown</div>
                </Col>
            </Col>

            <Col className="detailed-database">
                <RenderDatasets datasets={props.detailedData}/>
            </Col>
        </Container>
    );
}

export default DetailedDataset;