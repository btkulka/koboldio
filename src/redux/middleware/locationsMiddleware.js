import { 
    CREATE_STARTING_LOCATION, 
    SHOW_ALERT, 
    ADD_LOCATION, 
    REMOVE_LOCATION,
    CONNECT_ROAD,
    CHANGE_LOCATION,
    SET_LOCATION_WEATHER
} from "../types";
import { ALERT_TYPES } from '../../constants/AlertConstants';
import { BASE_BIOME_TYPES } from '../../constants/WeatherTypes';

const _ = require("lodash");

export const locationsMiddleware = store => next => action => {
    if (action.type === CREATE_STARTING_LOCATION) {
        store.dispatch({
            type: SHOW_ALERT,
            payload: {
                message: `<b>${action.payload.name}</b> created and set.`,
                type: ALERT_TYPES.Success
            }
        });
    } else if (action.type === ADD_LOCATION) {
        store.dispatch({
            type: SHOW_ALERT,
            payload: {
                message: `<b>${action.payload.name}</b> created.`,
                type: ALERT_TYPES.Success
            }
        });
    } else if (action.type === REMOVE_LOCATION) {
        store.dispatch({
            type: SHOW_ALERT,
            payload: {
                message: `<b>${action.payload.name}</b> removed.`,
                type: ALERT_TYPES.Success
            }
        });
    } else if (action.type === CONNECT_ROAD) {
        store.dispatch({
            type:SHOW_ALERT,
            payload: {
                message: `Built and connected <b>${action.payload.name}</b>.`,
                type: ALERT_TYPES.Success
            }
        });
    } else if (action.type === CHANGE_LOCATION) {
        let locations = store.getState().location.locations;
        if (locations.length > 0) {
            let location = _.find(locations, {"id": action.payload});
            store.dispatch({
                type: SET_LOCATION_WEATHER,
                payload: BASE_BIOME_TYPES[location.biome]
            });
        }
    }

    next(action);
}