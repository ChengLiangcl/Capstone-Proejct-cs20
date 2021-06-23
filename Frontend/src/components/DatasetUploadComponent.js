import React, { useState, useRef } from 'react';
import { IconButton, Modal } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import { Row, Col, Container, Progress, Button } from 'reactstrap';

function DatasetUpload(props) {
    const DATASET_REMIND = "Please upload your datasets";
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0); // tracking the status of uploading
    const [message, setMessage] = useState(DATASET_REMIND);
    const el = useRef(); // accesing input element

    //const validDatasetFormat = ["dat", "txt", "csv", "xlsx"];
    const [dataset_message, setDatasetFail] = useState("1");

    // read and identify if a file is invalid
    let readFileAsDataURL = async(file) => {
        let datasetMessage = '';
        let message = '';

        let reader = new FileReader();
        reader.onloadend = () => {
            let lines = reader.result.split('\n');
            //console.log("check lines: ", lines);
            try {
                const firstRow = lines[0].trim().split(" ");
                const secondRow = lines[1].trim().split(" ");

                if (firstRow.length !== secondRow.length) {
                    // check if it is a text format file
                    if (firstRow.length === 1) {
                        let line_check_first = parseFloat(firstRow[0]);
                        message = Number.isNaN(line_check_first) ? `# Could not upload ${file.name}. ` : `# ${file.name} uploaded successfully!  `;
                        datasetMessage += message;
                        setDatasetFail(datasetMessage);
                    }
                    else if (firstRow.length === 2){
                        let line_check_first = parseFloat(firstRow[0]);
                        let line_check_second = parseFloat(firstRow[1]);
                        message = Number.isNaN(line_check_first) || Number.isNaN(line_check_second) ? `# Could not upload ${file.name}. ` : `# ${file.name} uploaded successfully!  `;
                        datasetMessage += message;
                        setDatasetFail(datasetMessage);
                    }
                    else {
                        message = `# Could not upload ${file.name}. `;
                        datasetMessage += message;
                        setDatasetFail(datasetMessage);
                    }
                }
                else {
                    if (firstRow.length !== 1){
                        const checkLine = firstRow.slice(0, firstRow.length - 1).map(elem => Number.isNaN(parseFloat(elem)) ? "noUpdate" : "update");
                        message = checkLine.includes("noUpdate") ? `# Could not upload ${file.name}. ` : `# ${file.name} uploaded successfully!  `;
                        datasetMessage += message;
                        setDatasetFail(datasetMessage);
                    }
                    else{
                        let line_check_first = parseFloat(firstRow[0]);
                        let line_check_second = parseFloat(firstRow[1]);
                        message = Number.isNaN(line_check_first) || Number.isNaN(line_check_second) ? `# Could not upload ${file.name}. ` : `# ${file.name} uploaded successfully!  `;
                        datasetMessage += message;
                        setDatasetFail(datasetMessage);
                    }
                }

            }
            catch (e) {
                message = `# Could not upload ${file.name}. `;
                datasetMessage += message;
                setDatasetFail(datasetMessage);
            }
        };

        reader.onerror = () => {
            message = `# Could not upload ${file.name}. `;
            datasetMessage += message;
            setDatasetFail(datasetMessage);
        };

        reader.readAsText(file);

      }

    // It is for get the uploaded file you selected
    const handleDatasetChange = (event) => {
        const files = event.target.files; // accessing file
        let datasetMessage = '';
        console.log(files);
        for (let file of files) {
            let message = '';
            readFileAsDataURL(file);
        }
        setSelectedFiles(files); // storing file
    }

    const handleUploadBtn = () => {
        uploadFile();
    }

    const uploadFile = () => {
        setProgress(0);

        const formData = new FormData();
        formData.append('username', selectedFiles[0], sessionStorage.getItem('verifiedUsername'));
        if (selectedFiles !== undefined) {
            for (let i = 0; i < selectedFiles.length; i++) {
                formData.append(`file${i}`, selectedFiles[i]); // appending file
            }
        }

        // Display the keys
        // for (var key of formData.keys()) {
        //     console.log(key);
        // }

        setCurrentFile(selectedFiles);

        // 'props.uploadDataset' is from Redux actionCreators, which is used to post the uploaded dataset to the backend server
        props.uploadDataset(formData, (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        }, sessionStorage.getItem('verifiedUsername'))
            .then((response) => {
                setMessage("Uploaded successfully");
            })
            .catch(() => {
                setProgress(0);
                setMessage(dataset_message);
            });
    };

    return (
        <Container>
            <div>
                {currentFile && (<Progress animated value={progress} max="100">{progress}%</Progress>)}
            </div>

            {/** datasets */}
            <Row style={{ paddingTop: '2%' }}>
                <Col md="9">
                    <Row>
                        <label htmlFor="file-upload" data-testid="label-dataset">
                            <input type="file" id="file-upload" data-testid="select-dataset" multiple ref={el} onChange={handleDatasetChange} />
                            <div className="alert alert-light" role="alert">
                                {message.split("#").map(eachMessage =>
                                    <p>{eachMessage.includes("successfully") || eachMessage === DATASET_REMIND ? eachMessage : <div style={{ color: 'red' }}>{eachMessage}</div>}</p>
                                )}
                            </div>
                        </label>
                    </Row>
                </Col>

                <Col>
                    <Button
                        data-testid="upload-dataset-btn"
                        style={{ backgroundColor: "#378CC6" }}
                        disabled={!selectedFiles}
                        onClick={handleUploadBtn}>
                        Upload
                    </Button>
                </Col>

            </Row>
        </Container>
    );
}

export default DatasetUpload;

