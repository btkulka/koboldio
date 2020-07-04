import {
    ADD_EVENT,
    REMOVE_EVENT,
    SET_EVENTS,
    SET_EVENT_STACK,
    POP_EVENT_STACK
} from "../types";
import { EVENT_TYPES } from "../../constants/EventConstants";

const _ = require("lodash");

const initialState = {
    recurringEvents: [],
    events: [],
    eventStack: []
}

export default function(state = initialState, action){
    if (action.type === ADD_EVENT){
        let newState = Object.assign({}, state);
        if (action.payload.eventType === EVENT_TYPES.Single) {
            newState.events.push(action.payload);
        } else if (action.payload.eventType === EVENT_TYPES.Recurring) {
            newState.recurringEvents.push(action.payload);
        }
        return newState;
    } else if (action.type === REMOVE_EVENT) {
        let newState = Object.assign({}, state);
        _.remove(newState.events, {"id": action.payload});
        _.remove(newState.recurringEvents, {"id": action.payload});
        return newState;
    } else if (action.type === SET_EVENTS) {
        let newState = Object.assign({}, state);
        newState.events = action.payload.events;
        newState.recurringEvents = action.payload.recurringEvents;
        return newState;
    } else if (action.type === SET_EVENT_STACK) {
        let newState = Object.assign({}, state);
        newState.eventStack = action.payload;
        return newState;
    } else if (action.type === POP_EVENT_STACK) {
      let newState = Object.assign({}, state);
      newState.eventStack.shift();
      return newState;  
    } else {
        return state;
    }
}