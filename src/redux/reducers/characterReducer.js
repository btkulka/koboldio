import { 
    LOAD_CHARACTERS, 
    ADD_CHARACTER, 
    REMOVE_CHARACTER, 
    TICK_HUNGER,
    SET_PARTY_STATE,
    FEED_CHARACTER,
    REMOVE_FROM_PARTY,
    ADD_PARTY_MEMBER
} from "../types";
import TICK_CONSTANTS from '../../constants/TickConstants';
import { CLASSES, SIZES } from "../../constants/CharacterConstants";

const _ = require("lodash");

const baseHungerTick = TICK_CONSTANTS.day / 100;

const initialState = {
    characters: [],
    party: []
}

export default function(state = initialState, action) {
    if (action.type === LOAD_CHARACTERS) {
        let newState = Object.assign({}, state);
        newState.characters = [];
        newState.party = [];
        action.payload.forEach((character) => {
            if (character) {
                newState.characters.push(character);
                if (character?.inParty) {
                    newState.party.push(character);
                }
            }
        });
        return newState;
    } else if (action.type === ADD_CHARACTER) {
        let newState = Object.assign({}, state);
        const character = action.payload;
        newState.characters.push(character);
        if (character.inParty) {
            newState.party.push(character);
        }
        return newState;
    } else if (action.type === REMOVE_CHARACTER) {
        let newState = Object.assign({}, state);
        _.remove(newState.characters, {"id": action.payload});
        _.remove(newState.party, {"id": action.payload});
        return newState;
    } else if (action.type === TICK_HUNGER) {
        let newState = Object.assign({}, state);
        newState.party.forEach((character) => {
            let hungerChange = action.payload / baseHungerTick;
            // set hunger if not set
            if(character.hunger === undefined) {
                character.hunger = 100;
            }

            // class effect
            if (
                (character.class === CLASSES.Barbarian.name) ||
                (character.class === CLASSES.Fighter.name) ||
                (character.class === CLASSES.Paladin.name)
            ) {
                hungerChange = hungerChange * 1.33;
            }

            // size effect
            if (character.size === SIZES.Tiny) {
                hungerChange = hungerChange * 0.5;
            } else if (character.size === SIZES.Small) {
                hungerChange = hungerChange * 0.67;
            } else if (character.size === SIZES.Large) {
                hungerChange = hungerChange * 1.33;
            }
            

            character.hunger -= hungerChange;

            // cap at zero
            if (character.hunger < 0) {
                character.hunger = 0.01;
            }
        });
        return newState;
    } else if (action.type === SET_PARTY_STATE) {
      let newState = Object.assign({}, state);
      newState.party = action.payload ?? [];
      return newState;  
    } else if (action.type === FEED_CHARACTER) {
        let newState = Object.assign({}, state);
        newState.party.forEach((character) => {
            if (character.id === action.payload) {
                character.hunger += 25;
                if (character.hunger > 100) {
                    character.hunger = 100;
                }
            }
        });
        return newState;
    } else if (action.type === REMOVE_FROM_PARTY) {
        let newState = Object.assign({}, state);
        newState.party.forEach((character) => {
            if (character.id === action.payload) {
                character.inParty = false;
            }
        });
        _.remove(newState.party, {"id": action.payload});
        return newState;
    } else if (action.type === ADD_PARTY_MEMBER) {
        let newState = Object.assign({}, state);
        let character = _.find(newState.characters, {"id": action.payload});
        if (character) {
            newState.party.push(character);
        }
        return newState;
    } else {
        return state;
    }
}