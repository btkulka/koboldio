import { 
    LOAD_LOCATIONS, 
    CHANGE_LOCATION, 
    CREATE_STARTING_LOCATION 
} from "../types";

const initialState = {
    currentLocation: undefined,
    locations: []
};

export default function(state = initialState, action) {
    if (action.type === CREATE_STARTING_LOCATION){
        let newState = Object.assign({}, state);
        newState.currentLocation = action.payload;
        newState.locations.push(action.payload);
        return newState;
    } else if (action.type === LOAD_LOCATIONS) {
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
