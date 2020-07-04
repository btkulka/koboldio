import { 
    LOAD_LOCATIONS, 
    CHANGE_LOCATION, 
    CREATE_STARTING_LOCATION, 
    ADD_LOCATION,
    REMOVE_LOCATION,
    CONNECT_ROAD,
    REMOVE_ROAD,
    LOAD_ROADS,
    ADD_ROAD
} from "../types";

const initialState = {
    currentLocation: undefined,
    locations: [],
    roads: []
};

export default function(state = initialState, action) {
    if (action.type === CREATE_STARTING_LOCATION){
        let newState = Object.assign({}, state);
        newState.currentLocation = action.payload;
        newState.locations.push(action.payload);
        return newState;
    } else if (action.type === LOAD_LOCATIONS) {
        let newState = Object.assign({}, state);
        const locations = action.payload;
        newState.locations = locations;
        return newState;
    } else if (action.type === CHANGE_LOCATION) {
        let newState = Object.assign({}, state);
        if (action.payload === undefined) {
            newState.currentLocation = undefined;
        } else {
            newState.locations.forEach((location) => {
                if (location.id === action.payload) {
                    newState.currentLocation = location;
                }
            });
        }
        return newState;
    } else if (action.type === ADD_LOCATION) {
        let newState = Object.assign({}, state);
        newState.locations.push(action.payload);
        return newState;
    } else if (action.type === REMOVE_LOCATION) {
        let newState = Object.assign({}, state);
        const idx = newState.locations.indexOf(action.payload);
        newState.locations.splice(idx, 1);
        return newState;
    } else if (action.type === ADD_ROAD) {
        let newState = Object.assign({}, state);
        newState.roads.push(action.payload);
        return newState;
    } else if (action.type === CONNECT_ROAD) {
        const road = action.payload;

        let newState = Object.assign({}, state);
        let location1;
        let l1Idx;
        let l2Idx;
        let location2;

        newState.locations.forEach((location, index) => {
            if (location.id === road.location1Id) {
                location1 = location;
                l1Idx = index;
            } else if (location.id === road.location2Id) {
                location2 = location;
                l2Idx = index;
            }
        });
        
        location1.roads.push({
            id: road.id,
            name: road.name,
            to: location2.name,
            travelTime: road.travelTime
        });
        
        location2.roads.push({
            id: road.id,
            name: road.name,
            to: location1.name,
            travelTime: road.travelTime
        });

        newState.locations[l1Idx] = location1;
        newState.locations[l2Idx] = location2;

        return newState;
    } else if(action.type === REMOVE_ROAD) {
        const road = action.payload;
        let newState = Object.assign({}, state);
        newState.locations.forEach((location) => {
            if (location.id === road.location1Id || location.id === road.location2Id) {
                location.roads.forEach((r, index) => {
                    if (r.id === road.id) {
                        location.roads.splice(index, 12);
                    }
                });
            }
        });

        return newState;
    } else if (action.type === LOAD_ROADS) {
      let newState = Object.assign({}, state);
      newState.roads = action.payload;
      return newState;  
    } else {
        return state;
    }
}
