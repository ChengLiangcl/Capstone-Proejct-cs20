import * as ActionTypes from './ActionTypes';

export const User = (state = {
    isLoading: true,
    errMess: null,
  loginSuccess:false,
    userInfo: {}
}, action) => {
    switch (action.type) {
        case ActionTypes.LOGIN:
            console.log(action.payload);
            return { ...state, isLoading: false, loginSuccess:true };

        case ActionTypes.SIGN_UP:
            return { ...state }


        default:
            return state;
    }
};
