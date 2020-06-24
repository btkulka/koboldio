import { CREATE_STARTING_LOCATION, LOAD_LOCATIONS } from "../types";

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