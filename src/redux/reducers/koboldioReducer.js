import { combineReducers } from 'redux';
import clockReducer from './clockReducer';
import menuReducer from './menuReducer';
import calendarReducer from './calendarReducer';
import locationReducer from './locationReducer';
import alertsReducer from './alertsReducer';

const koboldioReducer = combineReducers({
    clock: clockReducer,
    menu: menuReducer,
    calendar: calendarReducer,
    location: locationReducer,
    alerts: alertsReducer
});

export default koboldioReducer;