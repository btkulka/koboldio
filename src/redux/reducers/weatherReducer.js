import { 
    TICK_WEATHER, 
    SET_LOCATION_WEATHER, 
    SET_CLOCK_WEATHER,
    SET_WEATHER
} from '../types';
import { SEASONAL_TEMPS, TIME_OF_DAY_TEMPS } from '../../constants/WeatherTypes';

const initialState = {
    globalTemp: 0,
    globalPrecipitation: 0,
    localTemp: 0,
    localPrecipitation: 0,
    seasonalTemp: 0,
    clockTemp: 0
}

export default function(state = initialState, action) {
    if (action.type === TICK_WEATHER) {
        // random temperature change
        let change = 0;
        let precipitationChange = 0;
        let tick = action.payload;
        while (tick >= 1000) {
            const tempRoll = ((Math.random() - 0.5) / 5);
            const skyRoll = ((Math.random() - 0.5) / 500);
            change = tempRoll;
            precipitationChange += skyRoll;
            tick -= 1000;
        }
        let newState = Object.assign({}, state);
        newState.globalTemp += change;

        // precipitation change
        let currentPrecipitation = newState.globalPrecipitation + newState.localPrecipitation;
        newState.globalPrecipitation += precipitationChange;
        if (currentPrecipitation > 1) {
            newState.globalPrecipitation -= (currentPrecipitation - 1);
        } else if (currentPrecipitation < 0) {
            newState.globalPrecipitation += (currentPrecipitation * -1);
        }

        return newState;
    } else if (action.type === SET_LOCATION_WEATHER) {
        let newState = Object.assign({}, state);

        // set local baselines
        newState.localPrecipitation = action.payload.averagePrecipitation;
        newState.localTemp = action.payload.averageTemp;

        // move global stats toward local stats
        newState.globalTemp -= ((newState.globalTemp + newState.localTemp) - newState.localTemp) / 2;
        newState.globalPrecipitation -= ((newState.globalPrecipitation + newState.localPrecipitation) - newState.localPrecipitation) / 2;
        return newState;
    } else if (action.type === SET_CLOCK_WEATHER) {
        let newState = Object.assign({}, state);

        // season
        let seasonalTemp = SEASONAL_TEMPS[action.payload.month];
        newState.seasonalTemp = seasonalTemp;

        // time of day
        let timeOfDayTemp = TIME_OF_DAY_TEMPS[action.payload.h];
        newState.clockTemp = timeOfDayTemp;

        return newState;
    } else if (action.type === SET_WEATHER) {
        return action.payload;  
    } else {
        return state;
    }
}