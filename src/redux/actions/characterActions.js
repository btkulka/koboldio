import { 
    ADD_CHARACTER,
    REMOVE_CHARACTER, 
    LOAD_CHARACTERS, 
    SET_PARTY_STATE,
    FEED_CHARACTER,
    REMOVE_FROM_PARTY,
    ADD_PARTY_MEMBER
} from "../types";

export function addCharacter(character) {
    return {
        type: ADD_CHARACTER,
        payload: character
    };
}

export function removeCharacter(characterId) {
    return {
        type: REMOVE_CHARACTER,
        payload: characterId
    };
}

export function loadCharacters(characters) {
    return {
        type: LOAD_CHARACTERS,
        payload: characters
    };
}

export function setPartyState(party) {
    return {
        type: SET_PARTY_STATE,
        payload: party
    };
}

export function feedCharacter(characterId) {
    return {
        type: FEED_CHARACTER,
        payload: characterId
    };
}

export function removeFromParty(characterId) {
    return {
        type: REMOVE_FROM_PARTY,
        payload: characterId
    };
}

export function addPartyMember(characterId) {
    return {
        type: ADD_PARTY_MEMBER,
        payload: characterId
    }
}