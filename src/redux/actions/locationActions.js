import { CREATE_STARTING_LOCATION, LOAD_LOCATIONS, ADD_LOCATION } from "../types";

export function createStartingLocation(location) {
    return {
        type: CREATE_STARTING_LOCATION,
        payload: location
    };
}

export function loadLocations(locations) {
    return {
        type: LOAD_LOCATIONS,
        payload: locations
    };
}

export function addLocation(location) {
    return {
        type: ADD_LOCATION,
        payload: location
    };
}