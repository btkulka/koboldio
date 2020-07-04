
 import { ALERT_TYPES } from '../../constants/AlertConstants';
 import TimeManager from '../../classes/TimeManager';
 import { EVENT_TYPES } from '../../constants/EventConstants';

 const { 
    ADD_EVENT,
    LOAD_EVENTS,
    REMOVE_EVENT,
    SHOW_ALERT,
    CALCULATE_EVENT_STACK,
    SET_EVENT_STACK
 } = require("../types");

function getEventById(id, store) {
    let calendar = store.getState().calendar;
    calendar.events.forEach((event) => {
        if (event.id === id) {
            return event;
        }
    });
    calendar.recurringEvents.forEach((event) => {
        if (event.id === id) {
            return event;
        }
    });
}

function generateRecurringEvent(recipe, currentDate) {

    // create a time manager
    let timeManager = new TimeManager(recipe.date);

    // while the current datetime is later than the recipe date, get and set the next recurring date
    while (timeManager.isLater(currentDate)) {
        timeManager.passTime(
            timeManager.getRecurringTimeStep(recipe.recurStep, recipe.recurMeasure)
        );
    }
    recipe.date = timeManager.currentDate;

    // return copy of date
    return Object.assign({}, recipe);
}

function isDateEarlier(event1, event2) {
    let date1 = event1.date;
    let timeManager = new TimeManager(date1);
    let date2 = event2.date;
    return timeManager.isEarlier(date2);
}

export const calendarMiddleware = store => next => action => {
    if (action.type === LOAD_EVENTS) {
      action.payload.forEach((event) => {
          store.dispatch({
              type: ADD_EVENT,
              payload: event
          });
      });
    } else if (action.type === REMOVE_EVENT) {
        let event = getEventById(action.payload, store);
        if (event) {
            store.dispatch({
                type: SHOW_ALERT,
                payload: {
                    type: ALERT_TYPES.Success,
                    message: `${event.name} was successfully removed.`
                }
            });
        }
    } else if (action.type === CALCULATE_EVENT_STACK) {
        // get a snapshot of the current time
        let clock = store.getState().clock.worldTime;
        let baseManager = new TimeManager(clock);
        // add all upcoming one-offs to holdLane
        let holdLane =  store.getState().calendar.events.slice();
        // store all recipes
        let eventRecipes = store.getState().calendar.recurringEvents.slice();
        // get all initial events from recipes and add to holdLane
        eventRecipes.forEach((recipe) => {
            let event = generateRecurringEvent(recipe, clock);
            holdLane.push(event);
        });

        // sort holdLane by most recent, pop nearest event to stack
        for (let i = 0; i < holdLane.length; i++) {
            let event = holdLane[i];
            for (let j = (i+1); j < holdLane.length; j++) {
                let comp = holdLane[j];
                if (isDateEarlier(event, comp)) {
                    const hold = holdLane[i];
                    holdLane[i] = holdLane[j];
                    holdLane[j] = hold;
                }
            }
        }

        // IF a recurring event is popped, generate another, insert into holdLane by date
        if (holdLane.length <= 10 && eventRecipes.length === 0) {
            store.dispatch({
                type: SET_EVENT_STACK,
                payload: holdLane
            });
        } else {
            let stack = [];
            baseManager.currentDate = clock;
            while (stack.length < 10) {
                let event = holdLane.shift();
                if (event.eventType === EVENT_TYPES.Recurring) {
                    let recurringEvent = generateRecurringEvent(Object.assign({}, event), {
                        ...event.date,
                        ms: event.date.ms + 1000
                    });
                    recurringEvent.campaignDay = baseManager.getCampaignDayFromDate(recurringEvent.date);
                    if (holdLane.length === 0) {
                        holdLane.push(recurringEvent);
                    } else {
                        let found = false;
                        for (let i = 0; i < holdLane.length; i++) {
                            if (isDateEarlier(holdLane[i], recurringEvent)) {
                                holdLane.splice(i, 0, recurringEvent);
                                found = true;
                                break;
                            }
                        }

                        if (!found) {
                            holdLane.push(recurringEvent);
                        } 
                    }
                }
                if (baseManager.isLater(event.date)){
                    stack.push(event);
                }
            }
    
            // return
            store.dispatch({
                type: SET_EVENT_STACK,
                payload: stack
            });
        }
    }

    next(action);
}