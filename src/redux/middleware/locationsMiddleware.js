import { CREATE_STARTING_LOCATION, SHOW_ALERT, ADD_LOCATION } from "../types";
import { ALERT_TYPES } from '../../constants/AlertConstants';

export const locationsMiddleware = store => next => action => {
    if (action.type === CREATE_STARTING_LOCATION) {
        store.dispatch({
            type: SHOW_ALERT,
            payload: {
                message: `'${action.payload.name}' created and set.`,
                type: ALERT_TYPES.Success
            }
        });
    } else if (action.type === ADD_LOCATION) {
        store.dispatch({
            type: SHOW_ALERT,
            payload: {
                message: `'${action.payload.name}' created.`,
                type: ALERT_TYPES.Success
            }
        });
    }

    next(action);
}