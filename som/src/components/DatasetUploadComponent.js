import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { IconButton, Modal } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import { Row, Col, Container, Progress } from 'reactstrap';

function DatasetUpload(props) {
    const DATASET_REMIND = "Please upload your datasets. (only accept .dat, .txt, .csv, .xlsx)"
    const [dfile, setFile] = useState(''); // storing the uploaded file
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0); // tracking the status of uploading
    const [message, setMessage] = useState(DATASET_REMIND);
    const el = useRef(); // accesing input element

    const validDatasetFormat = ["dat", "txt", "csv", "xlsx"];
    const [dataset_message, setDatasetFail] = useState("1");

    // It is for get the uploaded file you selected
    const handleChange = (event) => {
        const files = event.target.files; // accessing file
        let datasetMessage = '';
        for (let file of files) {
            const acceptedDatasetArray = file.name.split(".");
            const datasetExtension = acceptedDatasetArray.slice(acceptedDatasetArray.length - 1, acceptedDatasetArray.length)[0];
            let message = validDatasetFormat.includes(datasetExtension) ? `# ${file.name} uploaded successfully! ` : `# Could not upload ${file.name}. `;
            datasetMessage += message;
        }
        console.log("hahahaha: ", datasetMessage)
        setDatasetFail(datasetMessage);
        setSelectedFiles(event.target.files); // storing file
        console.log("accepted dataset: ", files);
        uploadFile(files);
    }

    const uploadFile = (files) => {
        setProgress(0);
        console.log("hahahaha3: ", dataset_message)
        const formData = new FormData();
        formData.append('username', files[0], sessionStorage.getItem('verifiedUsername'));
        if (files !== undefined) {
            for (let i = 0; i < files.length; i++) {
                formData.append(`file${i}`, files[i]); // appending file
            }
        }

        // Display the keys
        for (var key of formData.keys()) {
            console.log(key);
        }

        setCurrentFile(files);

        // 'props.uploadDataset' is from Redux actionCreators, which is used to post the uploaded dataset to the backend server
        props.uploadDataset(formData, (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        }, sessionStorage.getItem('verifiedUsername'))
        .then((response) => {
            setMessage("Uploaded successfully");
        })
        .catch(() => {
            setProgress(0);
            console.log("hahahaha2: ", dataset_message)
            setMessage("Could not upload the files. Please check their formats!");
            props.fetchDatasetFiles(sessionStorage.getItem('verifiedUsername'));
        });
    };

    return (
        <Container>
            <Row>
                <div className="md-2">
                    {/*TODO: users may only be allowed to upload .dat => <input> needs to add accept=".dat* ref={el} */}
                    <input type="file" multiple className="file-upload" id="file-upload" ref={el} onChange={handleChange} />
                    <label htmlFor="file-upload">
                        <IconButton aria-label="upload a dataset" component="span">
                            <PublishIcon />
                        </IconButton>
                    </label>
                </div>

                <div>
                    <div className="alert alert-light" role="alert">
                        {message !== "Uploaded successfully" && message !== DATASET_REMIND ? <div style={{ color: 'red' }}>{message}</div> : message}
                    </div>
                </div>
            </Row>


            <div>
                {currentFile && (<Progress animated value={progress} max="100">{progress}%</Progress>)}     
            </div>
        </Container>
    );
}

export default DatasetUpload;

