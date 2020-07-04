const { 
    LOAD_CLOCK_STATE, 
    SHOW_ALERT, 
    CHANGE_LOCATION, 
    CLOCK_TICK, 
    TICK_WEATHER, 
    SET_CLOCK_WEATHER,
    TICK_HUNGER
} = require("../types");
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
                message: `<b>${action.payload.campaignName}</b> successfully loaded.`,
                type: ALERT_TYPES.Success
            }
        });
    } else if (action.type === CLOCK_TICK) {
        
        // tick functions
        store.dispatch({
            type: TICK_WEATHER,
            payload: action.payload
        });

        store.dispatch({
            type: TICK_HUNGER,
            payload: action.payload
        });

        // set clock weather
        let clock = store.getState().clock.worldTime;
        store.dispatch({
            type: SET_CLOCK_WEATHER,
            payload: {
                month: clock.month,
                h: clock.h
            }
        });
    }

    next(action);
}