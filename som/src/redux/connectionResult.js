import * as ActionTypes from './ActionTypes';

export const ConnectionFiles = (state = {
    isLoading: true,
    errMess: null,
    connectionFiles: []
}, action) => {
    switch (action.type) {
        // when a user upload a dataset, we will first send the dataset to the server,
        // if the dataset is successfully added on the server site, and the server sends back a success of the posting of the dataset
        // only then we will add it to the redux store.
        case ActionTypes.ADD_CONNECTIONS:
            var files = action.payload; // get the uploaded dataset
            console.log("did i get the connected files? ", action.payload)
            return { ...state, connectionFiles: action.payload };

        default:
            return state;
    }
};