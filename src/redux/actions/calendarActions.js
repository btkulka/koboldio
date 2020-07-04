import { 
    ADD_EVENT, 
    REMOVE_EVENT, 
    LOAD_EVENTS,
    SET_EVENTS,
    CALCULATE_EVENT_STACK,
    SET_EVENT_STACK,
    POP_EVENT_STACK
} from '../types';

export function addEvent(event) {
    return {
        type: ADD_EVENT,
        payload: event
    };
}

export function removeEvent(event) {
    return {
        type: REMOVE_EVENT,
        payload: event
    };
}

export function loadEvents(events) {
    return {
        type: LOAD_EVENTS,
        payload: events
    };
}

export function setEvents(events) {
    return {
        type: SET_EVENTS,
        payload: events
    };
}

export function calculateEventStack() {
    return {
        type: CALCULATE_EVENT_STACK,
        payload: {}
    };
}

export function setEventStack(eventStack) {
    return {
        type: SET_EVENT_STACK,
        payload: eventStack
    }
}

export function popEventStack() {
    return {
        type: POP_EVENT_STACK,
        payload: {}
    };
}