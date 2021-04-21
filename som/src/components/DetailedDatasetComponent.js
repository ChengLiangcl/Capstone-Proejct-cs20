import React, { Component, useEffect, useRef, useState } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Table } from 'reactstrap';
import { Loading } from './LoadingComponent';
import {emptyMetadata} from '../redux/metadataEmpty';

const RenderDetailedData = React.memo(({ detailedData, isLoading, errMess }) => {
    // pass the datasetName to the backend server

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
        console.log("detailed data is:");
        console.log(detailedData);
        const colName = Object.keys(detailedData[Object.keys(detailedData)[0]]);
        console.log("colname is " + colName);
        return (
            <Table striped>
                <thead>
                    <tr key="tbhead">
                        {colName.map(col =>
                            <th key={col}>{col}</th>
                        )}
                    </tr>
                </thead>

                <tbody>
                    {Object.keys(detailedData).map(row => // [row1, row2, row3, row4, row5]
                        <tr>
                            {Object.values(detailedData[row]).map(value =>
                                <td>{value}</td>
                            )}
                        </tr>
                    )}
                </tbody>

            </Table>
        );
    }
}, true);

const RenderMetadata = React.memo(({ metadata, isLoading, errMess, fileName }) => {
    console.log("check metadata");
    console.log(JSON.stringify(metadata));
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
    else{
        return (
            <Container>
                <Row>
                    <Table size="sm">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Metadata: {fileName}</th>
                                <th></th>
                            </tr>
                        </thead>
    
                        <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>Dataset description:</td>
                                <td>{metadata.Description}</td>
                            </tr>
    
                            <tr>
                                <th scope="row">2</th>
                                <td>Source:</td>
                                <td>{metadata.Source}</td>
                            </tr>
    
                            <tr>
                                <th scope="row">3</th>
                                <td>Number of instances</td>
                                <td>{metadata.Number_of_Instance}</td>
                            </tr>
    
                            <tr>
                                <th scope="row">4</th>
                                <td>Number of attributes:</td>
                                <td>{metadata.Number_of_Attribute}</td>
                            </tr>
    
                            <tr>
                                <th scope="row">5</th>
                                <td>Whether the dataset contains labels:</td>
                                <td>{metadata.Label}</td>
                            </tr>

                            <tr>
                                <th scope="row">6</th>
                                <td>Keywords:</td>
                                <td>{JSON.stringify(metadata.Keywords)}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Row>
    
                <Row>
                    <Table size="sm">
                        <thead>
                            <tr>
                                <th>Attributes</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metadata.AttrInfo.map((eachAttr, index) =>
                                <tr key={index}>
                                    {Object.values(eachAttr).map(eachValue => <td key={eachValue}>{eachValue}</td>)}
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Row>
            </Container>
        );
    }
}, true);
   

const DetailedDataset = React.memo((props) => {
    const FileName = localStorage.getItem('datasetname-detaileddata');
    console.log("local get file name: ", FileName);
    
    useEffect(() => {
        props.sendNameForDetailedData(FileName, sessionStorage.getItem('verifiedUsername'));
    });
    
    return (
        <Container>
            <Col className="detailed-metadata" >
                <Col md={{ size: 7 }}>
                    <RenderMetadata metadata={props.metadata} isLoading={props.isLoading_metadata} errMess={props.errMess_metadata}
                        fileName={FileName} />
                </Col>
            </Col>

            <Col className="detailed-database">
                <RenderDetailedData detailedData={props.detailedData} isLoading={props.isLoading_detailedData} errMess={props.errMess_detailedData} />
            </Col>
        </Container>
    );
}, true);

export default DetailedDataset;