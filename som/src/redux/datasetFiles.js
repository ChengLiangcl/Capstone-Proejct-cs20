import * as ActionTypes from './ActionTypes';

export const DatasetFiles = (state = {
    isLoading: true,
    errMess: null,
    datasetFiles: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_DATASETFILES:
            console.log("Add datasetfiles to store");
            return { ...state, isLoading: false, errMess: null, datasetFiles: action.payload };

        case ActionTypes.DATASETFILES_LOADING:
            return { ...state, isLoading: true, errMess: null, datasetFiles: [] }

        case ActionTypes.DATASETFILES_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        // when a user upload a dataset, we will first send the dataset to the server,
        // if the dataset is successfully added on the server site, and the server sends back a success of the posting of the dataset
        // only then we will add it to the redux store.
        case ActionTypes.UPLOAD_DATASET:
            var dataset = action.payload; // get the uploaded dataset
            return { ...state, datasetFiles: state.datasetFiles.concat(dataset) };

        case ActionTypes.REMOVE_DATASET:
            console.log("start delete");
            var datasetName = action.payload; // to get the filename of the selected dataset
            let deletedIndex = 0; // to find the corresponding index based on filename
            console.log("get dataset is " + datasetName);
            for (let [index, eachDataset] of Object.entries(state.datasetFiles)) {
                if (eachDataset.FileName === datasetName) {
                    deletedIndex = parseInt(index, 10);
                }
            }

            console.log("deletedIndex is " + deletedIndex);

            const newDataset = [
                ...state.datasetFiles.slice(0, deletedIndex),
                ...state.datasetFiles.slice(deletedIndex + 1, state.datasetFiles.length)];

            return { ...state, datasetFiles: newDataset };


        default:
            return state;
    }
};