import * as ActionTypes from './ActionTypes';
import {DATASETFILES} from '../database/datasetFiles';
import { backendUrl } from '../server/backendUrl';

export const fetchDatasetFiles = () => (dispatch) => {

    dispatch(datasetFilesLoading(true));

    return fetch(backendUrl + 'datasetFiles') // backend address: Localhost: 3005/datasetFiles
    .then(response => response.json()) // when the promise resolved, we convert the incoming response into JSON by calling response.json
    .then(datasetFiles => dispatch(addDatasetFiles(datasetFiles))); // when the datasetFiles is obtained, we dispatch it into addDatasetFiles()
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

export const uploadDataset = (datasetId, fileName, size) => ({
    type: ActionTypes.UPLOAD_DATASET,
    payload: {
        _id: datasetId,
        FileName: fileName,
        Size: size
    }
});

