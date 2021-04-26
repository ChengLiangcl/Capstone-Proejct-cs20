import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Container, Progress, Card, CardBody, CardTitle, CardText, Button, CardColumns } from 'reactstrap';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { ListGroup, ListGroupItem } from 'reactstrap';
import PublishIcon from '@material-ui/icons/Publish';
import NeedUploading from './Modal/NeedUploading';

function ConnectionUploading(props) {
    const [selectedModel, setSelectedModel] = useState(undefined);
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [modelMessage, setModelMessage] = useState("Please upload your model");
    const [message, setMessage] = useState("Please upload your datasets");

    const [fileInfo, setFileInfos] = useState("");
    const [isModalOpen, setModal] = useState(false);

    const el = useRef(); // accesing input element


    // It is for get the uploaded file you selected
    const handleModelChange = (event) => {
        const file = event.target.files; // accessing file
        console.log(file.name);
        setSelectedModel(event.target.files[0]); // storing file
        //setFileInfos(file.name)
    }

    const handleDatasetChange = (event) => {
        const files = event.target.files
        setSelectedFiles(event.target.files); // storing file
        console.log("accepted dataset: ", files);
        //setFileInfos(file.name)
    }

    // We use selectedFiles for accessing current File as the first Item. 
    // Then we call UploadService.upload() method on the currentFile with a callback.
    const uploadModel = () => {
        setProgress(0);

        const formData = new FormData();

        formData.append('username', selectedModel, sessionStorage.getItem('verifiedUsername'));
        formData.append('model', selectedModel);

        if (selectedFiles !== undefined) {
            for (let i = 0; i < selectedFiles.length; i++) {
                formData.append(`file${i}`, selectedFiles[i]); // appending file
            }
        }

        // Display the keys
        for (var key of formData.keys()) {
            console.log(key);
        }

        console.log("selected file:", selectedFiles);

        setCurrentFile(selectedFiles);

        // 'props.uploadModel' is from Redux actionCreators, which is used to post the uploaded model to the backend server
        props.connectUploading(formData, (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        })
            .then(() => console.log("I'm back"))
            .then((response) => {
                setModelMessage("Uploaded successfully");
                setMessage("Uploaded successfully");
                console.log("get connect names: ", props.connectionFiles);
            })
            .catch(() => {
                setProgress(0);
                setModelMessage("Could not upload the model!");
                setMessage("Could not upload the datasets!");
            });
    };

    const handleUploadBtn = () => {
        if (selectedModel == undefined) {
            setModal(!isModalOpen);
        }
        else {
            uploadModel();
        }
    }

    const toggleModal = () => {
        setModal(!isModalOpen);
    };

    // while a user chooses not to delete a dataset
    const handlenNoBtn = () => {
        setModal(!isModalOpen);
    };

    return (
        <Container>

            <div>
                {currentFile && (<Progress animated value={progress} max="100">{progress}%</Progress>)}
            </div>

            <Row>
                <Col md="9">
                    <Row>
                        <label htmlFor="file-upload">
                            <input type="file" id="file-upload" ref={el} onChange={handleModelChange} />
                            <div className="alert alert-light" role="alert">
                                {modelMessage}
                            </div>
                        </label>
                    </Row>
                </Col>

                <Col>
                    <Button
                        style={{ backgroundColor: "#378CC6" }}
                        disabled={!selectedModel}
                        onClick={handleUploadBtn}>
                        Upload
                    </Button>
                </Col>

            </Row>

            {/** datasets */}
            <Row>
                <Col md="5">
                    <Row>
                        <label htmlFor="file-upload">
                            <input type="file" multiple ref={el} onChange={handleDatasetChange} />
                            <div className="alert alert-light" role="alert">
                                {message}
                            </div>
                        </label>
                    </Row>
                </Col>

                <Modal isOpen={isModalOpen} toggle={toggleModal} centered={true}>
                    <ModalHeader toggle={toggleModal}>Dataset Delete</ModalHeader>
                    <ModalBody>
                        <p>You have not selected any model. Please select one before uploading !</p>
                        <Row>
                            <Col>
                                <Button onClick={handleUploadBtn}>Got it!</Button>
                            </Col>
                        </Row>
                    </ModalBody>
                </Modal>
            </Row>

            <Card>
                <CardBody>
                    <CardTitle>
                        <h5 className="center">Last Uploading History</h5>
                        <p style={{ color: "grey", fontSize: "small" }}>Notice: the file name will be automatically modified if there is a file with same name in your database</p>
                    </CardTitle>
                </CardBody>
                <CardBody>
                    <CardTitle><strong>uploaded Model</strong></CardTitle>
                    <CardText>
                        <ListGroup>
                            <ListGroupItem className="justify-content-between">{props.connectionFiles[0]}</ListGroupItem>
                        </ListGroup>
                    </CardText>

                    <CardTitle><strong>uploaded Datasets</strong></CardTitle>
                    <CardText>
                        <ListGroup>
                            {props.connectionFiles[1].map((filename, index) => (
                                <ListGroupItem className="justify-content-between">{filename}</ListGroupItem>
                            ))}
                        </ListGroup>
                    </CardText>
                </CardBody>
            </Card>
        </Container>
    );

}

export default ConnectionUploading;