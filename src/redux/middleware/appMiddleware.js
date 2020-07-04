import { 
    LOAD_SESSION_STATE, 
    LOAD_CLOCK_STATE, 
    LOAD_LOCATIONS,
    CHANGE_LOCATION,
    LOAD_ROADS,
    SET_WEATHER,
    LOAD_CHARACTERS,
    SET_PARTY_STATE,
    SET_EVENTS
} from '../types';

export const appMiddleware = store => next => action => {
    if (action.type === LOAD_SESSION_STATE) {
        // set clock state
        store.dispatch({
            type: LOAD_CLOCK_STATE,
            payload: action.payload.clock
        });

        // LOCATION HANDLING ===================================

        // load locations
        store.dispatch({
            type: LOAD_LOCATIONS,
            payload: action.payload.location.locations
        });

        // load roads
        store.dispatch({
            type: LOAD_ROADS,
            payload: action.payload.location.roads
        });

        // set current location
        store.dispatch({
            type: CHANGE_LOCATION,
            payload: action.payload.location.currentLocation?.id
        });

        // WEATHER HANDLING ====================================
        store.dispatch({
            type: SET_WEATHER,
            payload: action.payload.weather
        });

        // CHARACTER HANDLING ==================================
        store.dispatch({
            type: LOAD_CHARACTERS,
            payload: action.payload.character.characters
        });

        store.dispatch({
            type: SET_PARTY_STATE,
            payload: action.payload.character.party
        });

        // EVENT HANDLING ============================
        if (action.payload.calendar) {
            store.dispatch({
                type: SET_EVENTS,
                payload: action.payload.calendar
            });
        }
    }

    next(action);
}