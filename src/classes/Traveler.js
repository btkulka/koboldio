const _ = require("lodash");

export default class Traveler {
    constructor(locations, roads, currentLocationId = null) {
        this.locations = locations;
        this.roads = roads;
        if (currentLocationId) {
            this.currentLocation = this.getLocationById(currentLocationId);
        } else {
            this.currentLocation = locations[0];
        }

        // member methods
        this.getLocationById = this.getLocationById.bind(this);
        this.traverseRoad = this.traverseRoad.bind(this)
    }

    getLocationById(locationId) {
        return _.find(this.locations, {"id": locationId});
    }

    // Travels down the given road if possible,
    // returns data on the road traveled by
    traverseRoad(roadId) {
        let connection = _.find(this.currentLocation.roads, {"id": roadId});
        if (connection) {
            const road = _.find(this.roads, {"id": roadId});
            const destinationId = road.location1Id !== this.currentLocation.id ? road.location1Id : road.location2Id;
            const destination = this.getLocationById(destinationId);
            this.currentLocation = destination;
            return road;
        }
    }
}