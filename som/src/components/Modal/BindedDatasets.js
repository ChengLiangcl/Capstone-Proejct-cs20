import { Modal, ModalHeader, ModalBody, Button, Row, Col, Container, Table, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { IconButton, TableRow } from '@material-ui/core';
import DeleteOneDataset from '../DeleteOneDataset';
import CreateIcon from '@material-ui/icons/Create';
import { Link } from 'react-router-dom';
import { Loading } from '../LoadingComponent';

function BindedDatasets(props) {
    const ModelName = localStorage.getItem('modelname') == undefined ? props.modelName : localStorage.getItem('modelname');
    console.log("local get model name: ", ModelName);

    const [isModalOpen, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!isModalOpen);
    };

    // while a user chooses not to delete a dataset
    const handlenNoBtn = () => {
        setModal(!isModalOpen);
    };

    const tableHead = () => {
        return (
            <thead>
                <tr>
                    <th>Model name</th>
                    <th>Description</th>
                    <th>Operation</th>
                </tr>
            </thead>
        );
    }

    const tableBody = (bindedDatasets) => {
        if (bindedDatasets.length === 0) {
            return (
                <tbody>
                    <div>No any binded datasets!</div>
                </tbody>
            );
        } else {
            console.log("get bindedDatasets: ", bindedDatasets);
            return (
                <tbody>
                    {bindedDatasets.map((dataset, index) =>
                        <tr key={index}>
                            <td style={{ verticalAlign: 'middle' }}>{dataset.FileName}</td>
                            <td style={{ verticalAlign: 'middle' }}>{dataset.BriefInfo}</td>
                            <td key={"operateEachDataset"}>
                                <Container>
                                    <Row>
                                        <DeleteOneDataset deleteDataset={props.deleteDataset}
                                            deletedFileName={dataset.FileName} />

                                        <Link to={`/metadata-form/${dataset.FileName}`}>
                                            <IconButton aria-label="create matadata" component="span">
                                                <CreateIcon />
                                            </IconButton>
                                        </Link>
                                    </Row>
                                </Container>
                            </td>
                        </tr>
                    )}
                </tbody>
            );
        }
    }

    const renderModelTable = (bindedDatasets, isLoading) => {
        console.log("check loading", isLoading);
        console.log("checked binded dataset: ", bindedDatasets);
        if (isLoading) {
            return (
                <Loading />
            );
        } else {
            return (
                <Table hover size="sm">
                    {tableHead()}
                    {tableBody(bindedDatasets)}
                </Table>
            );
        }
    }

    useEffect(() => {
        // fetch the existing metadata first
        console.log("start refreshing binded datasets", props.bindedDatasets);
        props.getBindedDatasets(ModelName, sessionStorage.getItem('verifiedUsername'));
    }, [props.bindedDatasets]);

    return (
        <Container>
            <Row>
                <Breadcrumb>
                    <BreadcrumbItem><Link to="/mymodels">My Models</Link></BreadcrumbItem>
                    <BreadcrumbItem active>Binded datasets of {ModelName}</BreadcrumbItem>
                </Breadcrumb>
                <div className="col-12">
                    <h3>Contact Us</h3>
                    <hr />
                </div>
            </Row>
            <Row>
                {renderModelTable(props.bindedDatasets, false)}
            </Row>
            
            {/**<Button onClick={toggleModal} style={{ backgroundColor: "transparent", border: 'none', color: "black" }}>{props.modelName}</Button>
            <Button style={{ backgroundColor: "transparent", border: 'none', color: "black" }} onClick={toggleModal}>{props.modelName}</Button>

            <Modal isOpen={isModalOpen} toggle={toggleModal} centered={true}>
                <ModalHeader toggle={toggleModal}>Binded Datasets</ModalHeader>
                <ModalBody style={{overflow: "auto"}}>
                    {JSON.stringify(props.bindedDatasets)}
                    {renderModelTable(props.bindedDatasets, false)}
                </ModalBody>
            </Modal>*/}
        </Container>

    );
}

export default BindedDatasets;