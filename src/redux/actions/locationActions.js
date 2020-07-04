import { 
    CREATE_STARTING_LOCATION, 
    LOAD_LOCATIONS,
    ADD_LOCATION, 
    REMOVE_LOCATION, 
    CHANGE_LOCATION,
    CONNECT_ROAD,
    REMOVE_ROAD,
    LOAD_ROADS,
    ADD_ROAD
} from "../types";

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

export function changeLocation(locationId) {
    return {
        type: CHANGE_LOCATION,
        payload: locationId
    };
}

export function addLocation(location) {
    return {
        type: ADD_LOCATION,
        payload: location
    };
}

export function removeLocation(location) {
    return {
        type: REMOVE_LOCATION,
        payload: location
    };
}

export function connectRoad(road) {
    return {
        type: CONNECT_ROAD,
        payload: road
    };
}

export function removeRoad(road) {
    return {
        type: REMOVE_ROAD,
        payload: road
    };
}

export function loadRoads(roads) {
    return {
        type: LOAD_ROADS,
        payload: roads
    };
}

export function addRoad(road) {
    return {
        type: ADD_ROAD,
        payload: road
    };
}