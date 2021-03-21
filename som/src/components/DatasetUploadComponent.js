import React, { useRef, useState } from 'react';
import axios from 'axios';
import { IconButton, Modal } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

// Dataset: NullDatasetFile 
import { DATASET } from '../database/datasetFile';

function DatasetUpload(props) {

    const [file, setFile] = useState(''); // storing the uploaded file
    // storing the recived file from backend
    //const [data, getFile] = useState({ name: "", size: "" });
    const el = useRef(); // accesing input element

    const addFile = (dataset, res) => {
        console.log(dataset);
            if (dataset.length === 1 && Object.values(dataset[0]).every(element => element === null)){
                Object.entries(res.data).map((kv) => {
                    dataset[0][kv[0]] = kv[1];
                });
            } else {
                dataset.push(res.data);
            }
            console.log(dataset);
    }

    // It sends the uploaded file to the backend server
    // After this, you can see your uploaded file in your 'public' fold in your backend
    // 这个用来将需要上传的文件提交到后端的服务器
    const uploadFile = (file) => {
        const formData = new FormData();
        formData.append('file', file); // appending file
        axios.post('http://localhost:4500/upload', formData).then(res => {
            console.log(res);
            /** 
            getFile({ name: res.data.name,
                     size: res.data.size
                   });*/
            // 这一步最后应该写在后端， 前端把res的值传给后端， 后端将数据存进MongoDB
            // 如果datasetFile表的长度为1，且values全为nul (空表单)， 则更新表单数据
            // 如果datasetFile长度大于或等于1， 且values不全为空 （表单中已存数据）， 则增加数据
            addFile(props.addDataset, res);
        }).catch(err => console.log(err))}
    
    // It is for get the uploaded file you selected
    // 这个用来获取到用户所选的本地文件
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
                    <AddIcon/>
                </IconButton>
            </label>
        </div>   
    );
}

export default DatasetUpload;