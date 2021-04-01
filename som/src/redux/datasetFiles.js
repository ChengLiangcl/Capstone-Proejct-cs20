import {DATASETFILES} from '../database/datasetFiles';
import * as ActionTypes from './ActionTypes';

export const DatasetFiles = (state = { isLoading: true, 
                                        errMess: null,
                                        datasetFiles: []}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_DATASETFILES:
            console.log("I wanna check dataset file");
            return {...state, isLoading: false, errMess: null, datasetFiles: action.payload};

        case ActionTypes.DATASETFILES_LOADING:
            return {...state, isLoading: true, errMess: null, datasetFiles: []}

        case ActionTypes.DATASETFILES_FAILED:
            return {...state, isLoading: false, errMess: action.payload};
        
        // when a user upload a dataset, we will first send the dataset to the server,
        // if the dataset is successfully added on the server site, and the server sends back a success of the posting of the dataset
        // only then we will add it to the redux store.
        case ActionTypes.UPLOAD_DATASET:
            var dataset = action.payload; // get the uploaded dataset
            return {...state, datasetFiles: state.datasetFiles.concat(dataset)}

        default:
          return state;
      }
};