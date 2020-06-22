import { 
    MANIPULATE_TIME, 
    CHANGE_TIME_MODE, 
    CLOCK_TICK, 
    RESET_CLOCK, 
    LOAD_CLOCK_STATE, 
    CHANGE_TITLE 
} from '../types';

export function manipulateTime(timeChange) {
    return {
        type: MANIPULATE_TIME,
        payload: timeChange
    };
}

export function changeTimeMode(mode) {
    return {
        type: CHANGE_TIME_MODE,
        payload: mode
    };
}

export function clockTick(tickValue) {
    return {
        type: CLOCK_TICK,
        payload: tickValue
    };
}

export function resetClock() {
    return {
        type: RESET_CLOCK,
        payload: {}
    };
}

export function loadClockState(clockState) {
    return {
        type: LOAD_CLOCK_STATE,
        payload: clockState
    };
}

export function changeTitle(title) {
    return {
        type: CHANGE_TITLE,
        payload: title
    };
}