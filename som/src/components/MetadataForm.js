import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { Button, Row, Col, Label, Container } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";

function MetadataForm(props) {
    const [tags, setTags] = useState([]);
    const [attr, setAttr] = useState(1);

    const handleSubmit = (values) => {
        console.log('Current State is: ' + JSON.stringify(values));
        alert('Current State is: ' + JSON.stringify(values));
    }

    const tagInputs = (tags) => {
        return <ReactTagInput tags={tags} onChange={(newTags) => setTags(newTags)} />
    }

    return (
        <Container>
            <Col className="metadata-info">
                <Row className="metadata-title">
                    <div className="title col-md-8">
                        <h4>Data Description - {props.dataset.FileName}</h4>
                    </div>
                    <div className="submit-button col-md-4 align-items-center">
                        <div><Button className="submit" style={{ backgroundColor: "#378CC6" }} >Submit</Button></div>
                    </div>
                </Row>

                <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                    <Col className="form-group">
                        <Row>
                            <Label htmlFor="briefInfo" md="2">Brief descripton:</Label>
                            <Col>
                                <Control.text model=".briefInfo" id="briefInfo" name="briefInfo"
                                    placeholder="Please input a brief description for the dataset"
                                    className="form-control" />
                            </Col>
                        </Row>
                    </Col>

                    <Col className="form-group">
                        <Label htmlFor="description">Dataset description:</Label>
                        <Col md={10}>
                            <Control.textarea model=".description" id="description" name="description"
                                row="6" className="form-control" />
                        </Col>
                    </Col>

                    <Col className="form-group">
                        <Row>
                            <Label htmlFor="keywords" md={2}>Key words:</Label>
                            <Col>
                                <ReactTagInput tags={tags} onChange={(newTags) => setTags(newTags)} />
                            </Col>
                        </Row>
                    </Col>

                    <Col className="form-group">
                        <Row>
                            <Label htmlFor="source" md={1}>Source:</Label>
                            <Col>
                                <Control.text model=".source" id="source" name="source"
                                    placeholder="Please input your source"
                                    className="form-control" />
                            </Col>
                        </Row>
                    </Col>

                    <Row className="form-group">
                        <Col md={5}>
                            <Label htmlFor="instance" md={10}>Number of instances:</Label>
                            <Col md={4}>
                                <Control.input model=".instance" id="instance" name="instance"
                                    className="form-control"
                                    min="0" type="number" step="1" />
                            </Col>
                        </Col>

                        <Col md={5}>
                            <Label htmlFor="attribute" md={10}>Number of attributes:</Label>
                            <Col md={4}>
                                <Control.input model=".attribute" id="attribute" name="attribute"
                                    className="form-control"
                                    min="0" type="number" step="1" />
                            </Col>
                        </Col>
                    </Row>

                    <Col className="form-group">
                        <Row>
                            <Label htmlFor="label" md={4}>Whether the dataset containes labels:</Label>
                            <Col md={2}>
                                <Control.select model=".label" id="label" name="label"
                                    className="form-control">
                                    <option>Yes</option>
                                    <option>No</option>
                                </Control.select>
                            </Col>
                        </Row>
                    </Col>

                    <Col className="form-group">
                        <Label htmlFor="attrInfo" style={{backgroundColor: "aliceblue", width: "100%"}}>Attribute Information:</Label>
                        <Col>
                            <Row>
                                <Label md={3} className="attribute" htmlFor="attrName">{`Attribute${attr}: `}</Label>
                                <Col className="align-item-center">
                                    <Control.text md={1} model=".attrName" id="attrName" name="attrName" placeholder="attribute name" className="form-control" />
                                </Col>

                                <Label md={3} className="attribute" htmlFor="attrDescription">{`Attribute${attr}: `}</Label>
                                <Col className="align-item-center">
                                    <Control.text md={1} model=".attrDescription" id="attrDescription" name="attrDescriptin" placeholder="description" className="form-control" />
                                </Col>
                            </Row>
                        </Col>
                    </Col>

                </LocalForm>


            </Col>
        </Container>
    );
}

export default MetadataForm;