import * as ActionTypes from './ActionTypes';
import { DATASETFILES } from '../database/datasetFiles';
import { MODELFILES } from '../database/modelFiles';
import { backendUrl } from '../server/backendUrl';
import http from "../server/baseUrl";
import baseUrl from '../server/baseUrl';
/**
 * User
 */
export const login = (data) => (dispatch) => {
  return http.post('/login', JSON.stringify(data), {
    headers: {
      "Content-Type": "multipart/form-data",
    }})
    .then(res => {
      if(res.data){
        dispatch(updateUser(res.data));// success
      }
    })
    .catch((err) => console.log(err));

}
export const signUp = (data) => (dispatch) => {

  return http.post('/sign-up', JSON.stringify(data), {
    headers: {
      "Content-Type": "multipart/form-data",
    }})
    .catch((err) => console.log(err));
}
export const updateUser = (userInfo) => ({
  type: ActionTypes.LOGIN,
  payload: userInfo
});

/**
 * Dataset
 */
// fetch datasets from the backend server
export const fetchDatasetFiles = () => (dispatch) => {
  // return dispatch(addDatasetFiles(DATASETFILES))
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

// uploading a new dataset file
export const uploadDataset = (dataset, onUploadProgress) => (dispatch) => {
    // post the uploaded dataset to the backend server
    return http.post('/upload', dataset, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      })
        .then(res => {
            console.log("this is response");
            console.log(res);
        })
        .then(res => {
            dispatch(fetchUploadedDataset());
        })
};

// get the uploded dataset info when the uploading is done in the backend
export const fetchUploadedDataset = () => (dispatch) => {
    return fetch(backendUrl + 'newDataset')
        .then(response => response.json())
        .then(dataset => dispatch(addDataset(dataset)))
        .then(data => {
            console.log("this is data");
            console.log(data);
        });
};

export const removeOneDataset = (datasetName) => ({
    type: ActionTypes.REMOVE_DATASET,
    payload: datasetName
});

// pass the filename to the backend server and tell it to delete corresponding dataset
export const deleteOneDataset = (datasetName) => (dispatch) => {
    return http.post('/delete-dataset', JSON.stringify(datasetName), {
        headers: {
          "Content-Type": "multipart/form-data",
        }})
        .then(res => {
            console.log("this is response for delete dataset");
            console.log(res);
            dispatch(removeOneDataset(res.data));
        })
        .catch((err) => console.log(err));
};


/**
 * Models
 */
// fetch models from the backend server
export const fetchModelFiles = () => (dispatch) => {
  // test
  // return dispatch(addModelFiles(MODELFILES))

  dispatch(modelFilesLoading(true));

  return fetch(backendUrl + 'modelFiles') // backend address: Localhost: 5000/modelFiles
    .then(response => response.json()) // when the promise resolved, we convert the incoming response into JSON by calling response.json
    .then(modelFiles => dispatch(addModelFiles(modelFiles))) // when the modelFiles is obtained, we dispatch it into addModelFiles()
    .then(data => console.log(data));
}

export const modelFilesLoading = () => ({
  type: ActionTypes.MODELFILES_LOADING
});

export const modelFilesFailed = (errmess) => ({
  type: ActionTypes.MODELFILES_FAILED,
  payload: errmess
});

export const addModelFiles = (modelFiles) => ({
  type: ActionTypes.ADD_MODELFILES,
  payload: modelFiles
});

export const addModel = (model) => ({
  type: ActionTypes.UPLOAD_MODEL,
  payload: model
});

// uploading a new model file
export const uploadModel = (model, onUploadProgress) => (dispatch) => {
  // post the uploaded model to the backend server
  return http.post('/upload-model', model, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  })
    .then(res => {
      console.log("this is response model");
      console.log(res);
    })
    .then(res => {
      dispatch(fetchUploadedModel());
    })
};

// get the uploded model info when the uploading is done in the backend
export const fetchUploadedModel = () => (dispatch) => {
  return fetch(backendUrl + 'newModel')
    .then(response => response.json())
    .then(model => dispatch(addModel(model)))
    .then(data => {
      console.log("this is data");
      console.log(data);
    });
};

export const removeOneModel = (modelName) => ({
  type: ActionTypes.REMOVE_MODEL,
  payload: modelName
});

export const editOneModelDescription = (modelName,description) => ({
  type: ActionTypes.EDIT_MODEL_DESCRIPTION,
  payload: {modelName,description}
});

// pass the filename to the backend server and tell it to delete corresponding model
export const deleteOneModel = (modelName) => (dispatch) => {
  return http.post('/delete-model', JSON.stringify(modelName), {
    headers: {
      "Content-Type": "multipart/form-data",
    }})
    .then(res => {
      console.log("this is response for delete model");
      console.log(res);
      dispatch(removeOneModel(res.data));
    })
    .catch((err) => console.log(err));
};
export const editModelDescription = (modelName,description) => (dispatch) => {
  return http.post('/edit-model-desc', JSON.stringify({modelName, description}), {
    headers: {
      "Content-Type": "multipart/form-data",
    }})
    .then(res => {
      console.log("this is response for delete model");
      console.log(res);
      dispatch(editOneModelDescription(modelName,description));
    })
    .catch((err) => console.log(err));
};
/**
 * Metadata
 */
// submit metadata of a dataset
export const submitMetadata = (metadata) => (dispatch) => {
    return http.post('/submit-metadata', JSON.stringify(metadata), {
        headers: {
          "Content-Type": "multipart/form-data",
        }})
        .then(res => {
            console.log("this is response for metadata");
            console.log(res);
        })
        .catch((err) => console.log(err));
};

export const addMetadata = (metadata) => ({
    type: ActionTypes.ADD_METADATA,
    payload: metadata
});

export const metadataFailed = (errmess) => ({
    type: ActionTypes.METADATA_FAILED,
    payload: errmess
});

export const metadataLoading = () => ({
    type: ActionTypes.METADATA_LOADING
});

/**
 * Detailed data
 */
export const sendNameForDetailedData = (datasetName) => (dispatch) => {
    console.log("start detailed loading")

    return http.post('/detailedData-name', JSON.stringify(datasetName), {
        headers: {
          "Content-Type": "multipart/form-data",
        }})
        .then(res => {
            console.log("this is response for detailed data");
            console.log(res.data);
            dispatch(addDetailedData(res.data[0]));
            dispatch(addMetadata(res.data[1]));
        })
        .catch((err) => console.log(err));
}



export const addDetailedData = (detaileddata) => ({
    type: ActionTypes.ADD_DETAILEDDATA,
    payload: detaileddata
});

export const detailedDataFailed = (errmess) => ({
    type: ActionTypes.DETAILEDDATA_FAILED,
    payload: errmess
});

export const detailedDataLoading = () => ({
    type: ActionTypes.DETAILEDDATA_LOADING
});


