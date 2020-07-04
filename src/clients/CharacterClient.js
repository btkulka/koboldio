export default class CharacterClient {
    constructor() {
        // methods
        this.createCharacter = this.createCharacter.bind(this);
        this.deleteCharacter = this.deleteCharacter.bind(this);
        this.getAllCharacters = this.getAllCharacters.bind(this);
    }

    async createCharacter(character) {
        let c;
        await fetch(`http://localhost:3401/characters/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(character)
        })
        .then(response => response.json())
        .then((char) => {
            c = char;
        });
        return c;
    }

    async deleteCharacter(characterId) {
        fetch(`http://localhost:3401/characters/${characterId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then((responseJson) => {
            return responseJson;
        });
    }

    async getAllCharacters(clockId) {
        fetch(`http://localhost:3401/characters?clockId=${clockId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then((characters) => {
            return characters;
        });
    }
}