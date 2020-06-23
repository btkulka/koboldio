import { SHOW_ALERT } from '../types';

export function showAlert(alert) {
    return {
        type: SHOW_ALERT,
        payload: alert
    };
}