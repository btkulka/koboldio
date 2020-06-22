import { CHANGE_LOCATION, LOAD_LOCATIONS } from "../types";

export function loadLocations(locations){
    return {
        type: LOAD_LOCATIONS,
        payload: locations
    };
}

export function changeLocation(location){
    return {
        type: CHANGE_LOCATION,
        payload: location
    };
}