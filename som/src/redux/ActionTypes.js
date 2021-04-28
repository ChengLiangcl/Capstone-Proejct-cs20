export const LOGIN = 'LOGIN';
export const SIGN_UP = 'SIGN_UP';

export const ADD_CONNECTIONS = 'ADD_CONNECTIONS'; // add connection files into the redux store
export const CLEAR_CONNECTIONS = "CLEAR_CONNECTIONS";
export const ADD_BINDDATASETS = 'ADD_BINDDATASETS';
export const BIND_LOADING = 'BIND_LOADING';
export const REMOVE_BIND = 'REMOVE_BIND'

export const DATASETFILES_LOADING = 'DATASETFILES_LOADING'; // means the datasets are currently being fetched, maybe from a server
export const DATASETFILES_FAILED = 'DATASETFILES_FAILED'; // means you fail to fetch dataset information from a server
export const ADD_DATASETFILES = 'ADD_DATASETFILES'; // you wanna add datasets into your Redux store
export const UPLOAD_DATASET = 'UPLOAD_DATASET'; // add the uploaded dataset to the Redux store
export const REMOVE_DATASET = 'REMOVE_DATASET'; // remove the selected dataset in the Redux store
export const MODIFY_BRIFINFO = 'MODIFY_BRIFINFO';

export const MODELFILES_LOADING = 'MODELFILES_LOADING'; // means the models are currently being fetched, maybe from a server
export const MODELFILES_FAILED = 'MODELFILES_FAILED'; // means you fail to fetch model information from a server
export const ADD_MODELFILES = 'ADD_MODELFILES'; // you wanna add models into your Redux store
export const UPLOAD_MODEL = 'UPLOAD_MODEL'; // add the uploaded model to the Redux store
export const REMOVE_MODEL = 'REMOVE_MODEL'; // remove the selected model in the Redux store
export const EDIT_MODEL_DESCRIPTION = 'EDIT_MODEL_DESCRIPTION';

export const SUBMIT_METADATA = 'SUBMIT_METADATA'; // post the metadata to the backend server
export const METADATA_LOADING = 'METADATA_LOADING';
export const METADATA_FAILED = 'METADATA_FAILED';
export const ADD_METADATA = 'ADD_METADATA'; // add the metadata to the Redux store

export const ADD_DETAILEDDATA = 'ADD_DETAILEDDATA'; // add thedetailed data in a dataset into the Redux store
export const DETAILEDDATA_LOADING = 'DETAILEDDATA_LOADING';
export const DETAILEDDATA_FAILED = 'DETAILEDDATA_FAILED';

