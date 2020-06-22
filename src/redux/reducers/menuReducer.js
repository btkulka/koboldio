import { LOAD_FILES } from '../types';

const initialState = {
    files: []
};

export default function (state = initialState, action) {
    if (action.type === LOAD_FILES ) {
        let newState = Object.assign({}, state);
        newState.files = action.payload;
        return newState;
    } else {
        return state;
    }
}