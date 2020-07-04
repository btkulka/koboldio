import TIME_MODES from '../../constants/TimeModes';
import { 
    CLOCK_TICK, 
    CHANGE_TIME_MODE, 
    RESET_CLOCK, 
    LOAD_CLOCK_STATE, 
    CHANGE_TITLE, 
    SET_CLOCK_ID 
} from '../types';
import { CAMPAIGN_DAY_ONE } from '../../constants/EventConstants';

// be sure to update blank game state in RESET_CLOCK as well
const initialState = {
    id: undefined,
    campaignName: 'untitled',
    elapsedTime: 0,
    elapsedWorldTime: 0,
    worldTime: CAMPAIGN_DAY_ONE,
    campaignDay: 1,
    mode: TIME_MODES.GameTime
};

export default function(state = initialState, action) {
    if (action.type === CLOCK_TICK) {
        let newState = Object.assign({}, state);
        let stateCampaignDay = newState.campaignDay;
        let tick = action.payload;
        let stateTime = newState.worldTime;
        stateTime.ms += tick;

        if (stateTime.ms >= 1000){
            stateTime.s += Math.floor(stateTime.ms / 1000);
            stateTime.ms = stateTime.ms % 1000;
        }
        if (stateTime.s >= 60) {
            stateTime.m += Math.floor(stateTime.s / 60);
            stateTime.s = stateTime.s % 60;         
        }
        if (stateTime.m >= 60) {
            stateTime.h += Math.floor(stateTime.m / 60);
            stateTime.m = stateTime.m % 60;
        }
        if (stateTime.h >= 24) {
            stateTime.d += Math.floor(stateTime.h / 24);
            stateCampaignDay += Math.floor(stateTime.h / 24);
            stateTime.h = stateTime.h % 24;
        }
        if (stateTime.d > 28) {
            stateTime.month += Math.floor(stateTime.d / 28);
            stateTime.d = stateTime.d % 28;
        }
        if (stateTime.month > 12) {
            stateTime.y += Math.floor(stateTime.month / 12);
            stateTime.month = stateTime.month % 12;
        }
        
        // set
        newState.worldTime = stateTime;
        newState.campaignDay = stateCampaignDay;
        newState.elapsedTime = newState.elapsedTime + 1000;
        newState.elapsedWorldTime = newState.elapsedWorldTime + tick;

        return newState;
    } else if (action.type === CHANGE_TIME_MODE) {
        let newState = Object.assign({}, state);
        newState.mode = action.payload;
        return newState;
    } else if (action.type === RESET_CLOCK) {
        return {
            campaignName: 'untitled',
            elapsedTime: 0,
            elapsedWorldTime: 0,
            worldTime: {
                y: 40,
                month: 3,
                d: 1,
                h: 12,
                m: 0,
                s: 0,
                ms: 0
            },
            campaignDay: 1,
            mode: TIME_MODES.GameTime
        };
    } else if (action.type === LOAD_CLOCK_STATE) {
        return action.payload;  
    } else if (action.type === CHANGE_TITLE) {
        let newState = Object.assign({}, state);
        newState.campaignName = action.payload;
        return newState;  
    } else if (action.type === SET_CLOCK_ID) {
        debugger;
        let newState = Object.assign({}, state);
        newState.id = action.payload;
        return newState;
    } else {
        return state;
    }
}