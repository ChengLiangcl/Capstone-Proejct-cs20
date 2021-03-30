import React, { useRef, useState } from 'react';
import axios from 'axios';
import { IconButton, Modal } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import http from "../server/baseUrl";


function DatasetUpload(props) {
    const [file, setFile] = useState(''); // storing the uploaded file
    const el = useRef(); // accesing input element
       

    const uploadFile = (file) => {
        const formData = new FormData();
        formData.append('file', file); // appending file
        props.addDataset(formData);
    }
    
    // It is for get the uploaded file you selected
    const handleChange = (e) => {
        const file = e.target.files[0]; // accessing file
        console.log(file);
        setFile(file); // storing file
        uploadFile(file);
    }

    return (
        <div>
            {/*TODO: users may only be allowed to upload .dat => <input> needs to add accept=".dat*/}
            <input type="file" id="file-upload" ref={el} onChange={handleChange}/>
            <label htmlFor="file-upload">
                <IconButton aria-label="upload a dataset" component="span">
                    <PublishIcon/>
                </IconButton>
            </label>
        </div>   
    );
}

export default DatasetUpload;

