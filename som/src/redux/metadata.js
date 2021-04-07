import * as ActionTypes from './ActionTypes';

export const Metadata = (state = {
    isLoading: true,
    errMess: null,
    metadata: []
}, action) => {

    switch (action.type) {
        case ActionTypes.ADD_METADATA:
            return { ...state, isLoading: false, errMess: null, metadata: action.payload };

        case ActionTypes.METADATA_LOADING:
            return { ...state, isLoading: true, errMess: null, metadata: [] }

        case ActionTypes.METADATA_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        default:
            return state;
    }
};