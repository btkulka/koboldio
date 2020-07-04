import { 
    REMOVE_FROM_PARTY, SHOW_ALERT
} from '../types';
import { ALERT_TYPES } from '../../constants/AlertConstants';
const _ = require("lodash");

export const characterMiddleware = store => next => action => {
    if (action.type === REMOVE_FROM_PARTY) {
        const character = _.find(store.getState().character.characters, {"id": action.payload});
        store.dispatch({
            type: SHOW_ALERT,
            payload: {
                type: ALERT_TYPES.Success,
                message: `${character.name} removed from party.`
            }
        });
    }

    next(action);
}