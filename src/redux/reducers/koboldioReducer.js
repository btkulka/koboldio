import { combineReducers } from 'redux';
import clockReducer from './clockReducer';
import menuReducer from './menuReducer';
import calendarReducer from './calendarReducer';
import locationReducer from './locationReducer';
import alertsReducer from './alertsReducer';
import appReducer from './appReducer';
import weatherReducer from './weatherReducer';
import characterReducer from './characterReducer';

const koboldioReducer = combineReducers({
    app: appReducer,
    clock: clockReducer,
    menu: menuReducer,
    calendar: calendarReducer,
    location: locationReducer,
    alerts: alertsReducer,
    weather: weatherReducer,
    character: characterReducer
});

export default koboldioReducer;