import {createStore, combineReducers, applyMiddleware} from 'redux';
import {DatasetFiles} from './datasetFiles';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            datasetFiles: DatasetFiles
        }),
        // applyMiddleware can return store enhancer
        // after this, thunk and logger are available within the application
        applyMiddleware(thunk, logger)
    );

    return store;
}