const { LOAD_CLOCK_STATE, SHOW_ALERT, CHANGE_LOCATION } = require("../types");
const { ALERT_TYPES } = require("../../constants/AlertConstants");

export const clockMiddleware = store => next => action => {
    if (action.type === LOAD_CLOCK_STATE) {
        store.dispatch({
            type: CHANGE_LOCATION,
            payload: action.payload.currentLocationId
        });
        store.dispatch({
            type: SHOW_ALERT,
            payload: {
                message: `'${action.payload.campaignName}' successfully loaded.`,
                type: ALERT_TYPES.Success
            }
        });
    }

    next(action);
}