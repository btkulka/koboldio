import { 
    LOAD_LOCATIONS, 
    CHANGE_LOCATION, 
    CREATE_STARTING_LOCATION, 
    ADD_LOCATION
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
        if (action.payload === undefined) {
            newState.currentLocation = undefined;
        } else if (action.type === ADD_LOCATION) {
            let newState = Object.assign({}, state);
            newState.locations.push(action.payload);
            debugger;
            return newState;
        } else {
            newState.locations.forEach((location) => {
                if (location.id === action.payload) {
                    newState.currentLocation = location;
                }
            });
        }
        return newState;
    } else {
        return state;
    }
}
