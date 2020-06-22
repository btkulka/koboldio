import { BASE_LOCATION } from "../../constants/Locations";
import { LOAD_LOCATIONS, CHANGE_LOCATION } from "../types";

const initialState = {
    currentLocation: BASE_LOCATION,
    locations: []
};

export default function(state = initialState, action) {
    if (action.type === LOAD_LOCATIONS) {
        let newState = Object.assign({}, state);
        newState.locations = action.payload;
        return newState;
    } else if (action.type === CHANGE_LOCATION) {
        let newState = Object.assign({}, state);
        newState.currentLocation = action.payload;
        return newState;
    } else {
        return state;
    }
}
