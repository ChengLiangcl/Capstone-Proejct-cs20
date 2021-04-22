import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Container, Progress, Card, CardBody, CardTitle, CardText, Button, CardColumns } from 'reactstrap';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { IconButton, Modal } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';

function ConnectionUploading(props) {
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("Please upload your model");

    const [fileInfo, setFileInfos] = useState("");

    const el = useRef(); // accesing input element

    // It is for get the uploaded file you selected
    const handleChange = (event) => {
        const file = event.target.files[0]; // accessing file
        console.log(file.name);
        setSelectedFiles(file); // storing file
        setFileInfos(file.name)
    }

    const renderModelUploading = () => {

    }

    // We use selectedFiles for accessing current File as the first Item. 
    // Then we call UploadService.upload() method on the currentFile with a callback.
    const uploadModel = () => {
        setProgress(0);

        const formData = new FormData();
        formData.append('username', selectedFiles, sessionStorage.getItem('verifiedUsername'));
        formData.append('file', selectedFiles); // appending file

        console.log("formdata:", formData);
        console.log("selected file:", selectedFiles);

        setCurrentFile(selectedFiles);

        // 'props.uploadModel' is from Redux actionCreators, which is used to post the uploaded model to the backend server
        props.connectUploading(formData, (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        })
        .then(() => console.log("I'm back"))
        .then((response) => {
            setMessage("Uploaded successfully");
            console.log("get connect names: ", props.connectionFiles);
        })
        .catch(() => {
            setProgress(0);
            setMessage("Could not upload the file!");
        });
    };

    return (
        <Container>
            <div>
                {currentFile && (<Progress animated value={progress} max="100">{progress}%</Progress>)}
            </div>

            <Row>
                <Col md="5">
                    <Row>
                        <input type="file" id="file-upload" ref={el} onChange={handleChange} />
                        <label htmlFor="file-upload">
                            <IconButton aria-label="upload a model" component="span">
                                <PublishIcon />
                            </IconButton>
                        </label>
                        <div className="alert alert-light" role="alert">
                            {fileInfo}
                        </div>
                    </Row>
                </Col>

                <Col>
                    <button
                        className="btn btn-success"
                        disabled={!selectedFiles}
                        onClick={uploadModel}
                    >
                        Upload
                    </button>
                </Col>
            </Row>

            <Row>
                <div className="alert alert-light" role="alert">
                    {message}
                </div>
            </Row>
 
            <Card>
                <CardBody>
                    <CardTitle>List of Files</CardTitle>
                    <CardText>
                        {JSON.stringify(props.connectionFiles)}
                        <ListGroup>
                            {props.connectionFiles.map((filename, index) => (
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