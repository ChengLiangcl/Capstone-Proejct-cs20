import * as ActionTypes from './ActionTypes';

export const ConnectionFiles = (state = {
    isLoading: true,
    errMess: null,
    connectionFiles: ["this is for a uploaded model", ["this is for uploaded datasets"]],
    uploadingStatus: ["", ""],
    bindedDatasets: [],
    umatrixDatasets: []
}, action) => {
    switch (action.type) {
        // when a user upload a dataset, we will first send the dataset to the server,
        // if the dataset is successfully added on the server site, and the server sends back a success of the posting of the dataset
        // only then we will add it to the redux store.
        case ActionTypes.ADD_CONNECTIONS:
            var files = action.payload; // get the uploaded dataset
            return { ...state, connectionFiles: action.payload };

        case ActionTypes.ADD_UMATRIXDATASETS:
            //console.log("did i get the umatrix datasets? ", action.payload)
            return { ...state, isLoading: false, umatrixDatasets: action.payload };

        case ActionTypes.UPDATE_UPLOADINGSTATUS:
            return { ...state, uploadingStatus: action.payload };

        case ActionTypes.CLEAR_CONNECTIONS:
            const connectionFiles = ["", [""]]
            return { ...state, connectionFiles: connectionFiles };

        case ActionTypes.ADD_BINDDATASETS:
            return { ...state, isLoading: false, bindedDatasets: action.payload };

        case ActionTypes.BIND_LOADING:
            return { ...state, isLoading: true, errMess: null, bindedDatasets: [] };

        // case ActionTypes.REMOVE_BIND:
        //     var datasetName = action.payload; // to get the filename of the selected dataset
        //     let deletedIndex = 0; // to find the corresponding index based on filename
        //     for (let [index, eachDataset] of Object.entries(state.bindedDatasets)) {
        //         if (eachDataset.FileName === datasetName) {
        //             deletedIndex = parseInt(index, 10);
        //         }
        //     }

        //     console.log("deletedIndex is " + deletedIndex);

        //     const newDataset = [
        //         ...state.datasetFiles.slice(0, deletedIndex),
        //         ...state.datasetFiles.slice(deletedIndex + 1, state.datasetFiles.length)];

        //     return { ...state, bindedDatasets: newDataset };

        default:
            return state;
    }
};