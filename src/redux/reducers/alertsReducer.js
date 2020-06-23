import { ALERT_TYPES } from '../../constants/AlertConstants';
import { SHOW_ALERT } from '../types';

const initialState = {
    type: ALERT_TYPES.Info,
    message: undefined
};

export default function(state = initialState, action) {
    if (action.type === SHOW_ALERT) {
        let newState = Object.assign({}, state);
        newState.type = action.payload.type;
        newState.message = action.payload.message;
        return newState;
    } else {
        return state;
    }
}