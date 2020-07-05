import {
    CHANGE_APP_MODE, 
    LOAD_SESSION_STATE,
    REGISTER_USER,
    LOG_IN,
    LOG_OUT
} from "../types";

export function changeAppMode(mode) {
    return {
        type: CHANGE_APP_MODE,
        payload: mode
    };
}

export function loadSessionState(sessionState) {
    return {
        type: LOAD_SESSION_STATE,
        payload: sessionState
    };
}

export function registerUser(user) {
    return {
        type: REGISTER_USER,
        payload: user
    };
}

export function logIn(user) {
    return {
        type: LOG_IN,
        payload: user
    };
}

export function logOut() {
    return {
        type: LOG_OUT,
        payload: {}
    };
}