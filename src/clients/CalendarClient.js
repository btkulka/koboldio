export default class CalendarClient {
    constructor() {
        // methods
        this.createEvent = this.createEvent.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
        this.getAllEvents = this.getAllEvents.bind(this);
    }

    async createEvent(event) {
        let e;
        await fetch(`http://localhost:3401/events/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        })
        .then(response => response.json())
        .then((evt) => {
            e = evt;
        });
        return e;
    }

    async deleteEvent(eventId) {
        fetch(`http://localhost:3401/events/${eventId}`, {
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

    async getAllEvents(clockId) {
        let e = [];
        await fetch(`http://localhost:3401/events?clockId=${clockId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then((events) => {
            if (events) {
                e = events;
            }
        });

        return e;
    }
}