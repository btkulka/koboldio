import { CREATE_STARTING_LOCATION } from "../types";

export function createStartingLocation(location) {
    return {
        type: CREATE_STARTING_LOCATION,
        payload: location
    };
}