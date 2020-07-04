import { SET_LOCATION_WEATHER, SET_WEATHER, SET_CLOCK_WEATHER } from '../types';

export function setLocationWeather(locationBiome) {
    return {
        type: SET_LOCATION_WEATHER,
        payload: locationBiome
    };
}

export function setWeather(weatherState) {
    return {
        type: SET_WEATHER,
        payload: weatherState
    };
}

export function setClockWeather(worldTime) {
    return {
        type: SET_CLOCK_WEATHER,
        payload: worldTime
    };
}