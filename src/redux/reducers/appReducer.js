import { APP_MODES } from "../../constants/AppModes";
import { CHANGE_APP_MODE } from '../types';

const initialState = {
    mode: APP_MODES.Clock
}

export default function(state = initialState, action) {
    if (action.type === CHANGE_APP_MODE) {
        let newState = Object.assign({}, state);
        newState.mode = action.payload;
        return newState;
    } else {
        return state;
    }
}