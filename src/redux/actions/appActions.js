import { CHANGE_APP_MODE } from "../types";

export function changeAppMode(mode) {
    return {
        type: CHANGE_APP_MODE,
        payload: mode
    };
}