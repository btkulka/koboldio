import { APP_MODES } from "../../constants/AppModes";
import { 
    CHANGE_APP_MODE,
    SET_USER
} from '../types';

const initialState = {
    mode: APP_MODES.Clock,
    user: undefined
}

export default function(state = initialState, action) {
    if (action.type === CHANGE_APP_MODE) {
        let newState = Object.assign({}, state);
        newState.mode = action.payload;
        return newState;
    } else if (action.type === SET_USER) {
        let newState = Object.assign({}, state);
        newState.user = action.payload;
        return newState;
    } else {
        return state;
    }
}