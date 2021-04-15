import {createStore, combineReducers, applyMiddleware} from 'redux';
import { createForms } from 'react-redux-form';
import { DatasetFiles } from './datasetFiles';
import { DetailedData } from './detailedData';
import { Metadata } from './metadata';
import {IntialMetadata} from './metadataForm'
import thunk from 'redux-thunk';
import logger from 'redux-logger';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            datasetFiles: DatasetFiles,
            detailedData: DetailedData,
            metadata: Metadata,
            ...createForms({
                initialMetadata: IntialMetadata
            })
        }),
        // applyMiddleware can return store enhancer
        // after this, thunk and logger are available within the application
        applyMiddleware(thunk, logger)
    );

    return store;
}