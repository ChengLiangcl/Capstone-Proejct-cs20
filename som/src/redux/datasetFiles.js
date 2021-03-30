import {DATASETFILES} from '../database/datasetFiles';
import * as ActionTypes from './ActionTypes';

export const DatasetFiles = (state = { isLoading: true, 
                                        errMess: null,
                                        datasetFiles: []}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_DATASETFILES:
            return {...state, isLoading: false, errMess: null, datasetFiles: action.payload};

        case ActionTypes.DATASETFILES_LOADING:
            return {...state, isLoading: true, errMess: null, datasetFiles: []}

        case ActionTypes.DATASETFILES_FAILED:
            return {...state, isLoading: false, errMess: action.payload};

        default:
          return state;
      }
};