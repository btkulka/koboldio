import { combineReducers } from 'redux';
import clockReducer from './clockReducer';
import menuReducer from './menuReducer';
import calendarReducer from './calendarReducer';
import locationReducer from './locationReducer';

const koboldioReducer = combineReducers({
    clock: clockReducer,
    menu: menuReducer,
    calendar: calendarReducer,
    location: locationReducer
});

export default koboldioReducer;