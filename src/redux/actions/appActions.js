import { CHANGE_APP_MODE, LOAD_SESSION_STATE } from "../types";

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