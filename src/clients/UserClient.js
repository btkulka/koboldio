export default class UserClient {
    constructor() {
        // methods
        this.createUser = this.createUser.bind(this);
    }

    async createUser(user) {
        return new Promise((resolve, reject) => {
            fetch(`http://localhost:3401/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(response => response.json())
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                console.log(err.message);
                reject(undefined);
            });
        });
    }

    async logIn(user) {
        return new Promise((resolve, reject) =>{ 
            fetch(`http://localhost:3401/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
            })
            .then(response => response.json())
            .then((token) => {
                resolve(token);
            })
            .catch((err) => {
                console.log(err.message);
                reject(undefined);
            });
        });
    }
}