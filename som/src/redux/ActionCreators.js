import * as ActionTypes from './ActionTypes';
import {DATASETFILES} from '../database/datasetFiles';
import { backendUrl } from '../server/backendUrl';
import http from "../server/baseUrl";

export const fetchDatasetFiles = () => (dispatch) => {

    dispatch(datasetFilesLoading(true));

    return fetch(backendUrl + 'datasetFiles') // backend address: Localhost: 5000/datasetFiles
    .then(response => response.json()) // when the promise resolved, we convert the incoming response into JSON by calling response.json
    .then(datasetFiles => dispatch(addDatasetFiles(datasetFiles))) // when the datasetFiles is obtained, we dispatch it into addDatasetFiles()
    .then(data => console.log(data));
}

export const datasetFilesLoading = () => ({
    type: ActionTypes.DATASETFILES_LOADING
});

export const datasetFilesFailed = (errmess) => ({
    type: ActionTypes.DATASETFILES_FAILED,
    payload: errmess
});

export const addDatasetFiles = (datasetFiles) => ({
    type: ActionTypes.ADD_DATASETFILES,
    payload: datasetFiles
});

export const addDataset = (dataset) => ({
    type: ActionTypes.UPLOAD_DATASET,
    payload: dataset
});

export const uploadDataset = (dataset) => (dispatch) => {
    // post the uploaded dataset to the backend server
    return http.post('/upload', dataset)
            .then(res => {
                console.log(res);
            })
            .then( res => {
                dispatch(fetchUploadedDataset());
                })
            .catch(err => console.log(err))
    // TODO: get the returned dataset info from the backend server
};


export const fetchUploadedDataset = () => (dispatch) => {
    //dispatch(newDatasetLoading(true));

    return fetch(backendUrl + 'newDataset')
            .then(response => response.json()) 
            .then(dataset => dispatch(addDataset(dataset)))
            .then(data => {
                console.log("this is data");
                console.log(data);
            })
            .catch(err => console.log(err))
};

export const newDatasetLoading = () => ({
    type: ActionTypes.LOAD_NEWDATASET
});
