import { 
    LOAD_SESSION_STATE, 
    LOAD_CLOCK_STATE, 
    LOAD_LOCATIONS,
    CHANGE_LOCATION,
    LOAD_ROADS,
    SET_WEATHER,
    LOAD_CHARACTERS,
    SET_PARTY_STATE,
    SET_EVENTS,
    REGISTER_USER,
    SET_USER,
    LOG_OUT,
    LOG_IN,
    CHANGE_APP_MODE
} from '../types';
import UserClient from '../../clients/UserClient';
import { APP_MODES } from '../../constants/AppModes';
const jwt = require("jsonwebtoken");

export const appMiddleware = store => next => async action => {
    if (action.type === LOAD_SESSION_STATE) {
        // APP HANDLING ========================================
        store.dispatch({
            type: SET_USER,
            payload: action.payload.app?.user
        });
        
        // CLOCK HANDLING ======================================
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
    } else if (action.type === REGISTER_USER) {
        const userClient = new UserClient();
        let user = action.payload;
        const registerResponse = await userClient.createUser(user);

        if (registerResponse._id) {
            user.id = registerResponse._id;
            const token = await userClient.logIn(user);
            if (token) {
                user.token = token;
                store.dispatch({
                    type: SET_USER,
                    payload: user
                });
            }
        }
    } else if (action.type === LOG_OUT) {
        store.dispatch({
            type: SET_USER,
            payload: undefined
        });
        store.dispatch({
            type: CHANGE_APP_MODE,
            payload: APP_MODES.Clock
        });
    } else if (action.type === LOG_IN) {
        const userClient = new UserClient();
        const { token } = await userClient.logIn(action.payload);
        if (token) {
            let user = jwt.decode(token);
            user.token = token;
            store.dispatch({
                type: SET_USER,
                payload: user
            });
            store.dispatch({
                type: CHANGE_APP_MODE,
                payload: APP_MODES.Clock
            });
        }
    }

    next(action);
}