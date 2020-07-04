import React, { Component } from 'react';
import './LocationDashboard.css';
import {connect} from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import KoboldioModal from '../Generics/KoboldioModal';
import LocationCreationForm from '../LocationCreationForm';
import { createStartingLocation, changeLocation } from '../../redux/actions/locationActions';
import { clockTick } from '../../redux/actions/clockActions';
import Traveler from '../../classes/Traveler';
import TimeManager from '../../classes/TimeManager';
import WeatherTile from './WeatherTile';

let BLANK_ROUTE = {
    path: [],
    travelTime: 0,
    currentLocationId: undefined
}

class LocationDashboard extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLocationCreatorVisible: false,
            isLocationSelectorVisible: false,
            displaySetLocationWarning: false,
            isTravelSelectorVisible: false,
            currentRoute: BLANK_ROUTE
        };
        
        // internal methods
        this._closeLocationCreator = this._closeLocationCreator.bind(this);
        this._createStartingLocation = this._createStartingLocation.bind(this);
        this._closeLocationSelector = this._closeLocationSelector.bind(this);
        this._changeLocation = this._changeLocation.bind(this);
        this._updateChangeLocationSelection = this._updateChangeLocationSelection.bind(this);
        this._closeTravelSelector = this._closeTravelSelector.bind(this);
        this._getTravelOptions = this._getTravelOptions.bind(this);
        this._travelToLocation = this._travelToLocation.bind(this);
        this._printCurrentRouteBreadcrumbs = this._printCurrentRouteBreadcrumbs.bind(this);
        
        // methods
        this.getLocationById = this.getLocationById.bind(this);
        this.getLocationByName = this.getLocationByName.bind(this);
        this.getAllConnectedLocations = this.getAllConnectedLocations.bind(this);
        this.findRoutesToDestination = this.findRoutesToDestination.bind(this);
    }

    componentDidUpdate(prevProps) {
        // set a default selection once locations have loaded
        if (prevProps.location.locations !== this.props.location.locations && 
            this.state.changeLocationSelection === undefined) {
                this.setState({
                    changeLocationSelection: this.defaultLocationId,
                    travelSelection: this.defaultLocationId
                });
        }
    }

    get locationOptions() {
        let locations = [];
        this.props.location.locations.forEach((location) => {
            if (location !== this.props.location.currentLocation) {
                locations.push(
                    <option
                        key={`change-location-select-item-${location.id}`}
                        className="kb-select-item"
                        value={location.id}
                    >
                        { location.name }
                    </option>
                );
            }
        });
        return locations;
    }

    _getTravelOptions() {
        if (!this.props.location.currentLocation?.id) {
            return [];
        } else {
            let locations = [
                <option
                    key={`change-location-select-item-empty`}
                    className="kb-select-item"
                    value={undefined}
                >
                </option>
            ];
            let connections = this.getAllConnectedLocations(this.props.location.currentLocation.id);
            connections.forEach((location) => {
                if (location !== this.props.location.currentLocation) {
                    locations.push(
                        <option
                            key={`change-location-select-item-${location.id}`}
                            className="kb-select-item"
                            value={location.id}
                        >
                            { location.name }
                        </option>
                    );
                }
            });
            return locations;
        }
    }

    get defaultLocationId() {
        let defaultLocation = this.props.location.locations[0];
        return defaultLocation?.id;
    }

    getLocationById(locationId) {
        let found = undefined;
        this.props.location.locations.forEach((location) => {
            if (location.id === locationId) {
                found = location;
            }
        })

        return found;
    }

    getLocationByName(locationName) {
        let found = undefined;
        this.props.location.locations.forEach((location) => {
            if (location.name === locationName) {
                found = location;
            }
        });

        return found;
    }

    getAllConnectedLocations(currentLocationId, locations = [], roadsTraversed = []) {
        let location = this.getLocationById(currentLocationId);
        if (!locations.includes(location)) {
            locations.push(location);
        }
        location.roads.forEach((road) => {
            if (!roadsTraversed.includes(road.id)) {
                roadsTraversed.push(road.id);
                let destination = this.getLocationByName(road.to);
                locations.concat(this.getAllConnectedLocations(destination.id, locations, roadsTraversed));
            }
        })

        return locations;
    }

    findRoutesToDestination(route, destinationId) {
        let location = this.getLocationById(route.currentLocationId);
        if (location.id === destinationId ) {
            // we made it!
            return [route];
        } else if (location.roads === []) {
            // dead end
            return [];
        } else if (location.roads !== []) {
            let routes = [];
            location.roads.forEach((road) => {
                if (!route.path.includes(road.id)) {
                    const newRoute = Object.assign({}, route);
                    const newPath = route.path.slice();
                    newPath.push(road.id);
                    newRoute.path = newPath;
                    newRoute.travelTime += Number(road.travelTime);
                    newRoute.currentLocationId = this.getLocationByName(road.to).id;
                    const newRouteCollection = this.findRoutesToDestination(newRoute, destinationId)
                    routes = routes.concat(newRouteCollection);
                }
            });
            return routes;
        }
    }

    _closeLocationCreator() {
        this.setState({
            isLocationCreatorVisible: false
        });
    }

    _closeLocationSelector() {
        this.setState({
            isLocationSelectorVisible: false,
            displaySetLocationWarning: false
        });
    }

    _closeTravelSelector() {
        this.setState({
            isTravelSelectorVisible: false,
            currentRoute: BLANK_ROUTE
        });
    }

    async _createStartingLocation(location) {
        location.clockId = this.props.clock.id;
        location.roads = [];
        fetch("http://localhost:3401/locations", {
            method: 'POST',
            body: JSON.stringify(location),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then((data) => {
            location.id = data.id;
            this.props.createStartingLocation(location);
            this.setState({
                isLocationCreatorVisible: false
            });
        });
    }

    _changeLocation() {
        this.props.changeLocation(this.state.changeLocationSelection);
        this.setState({
            isLocationSelectorVisible: false
        });
    }

    _updateChangeLocationSelection(locationId) {
        this.setState({
            changeLocationSelection: Number(locationId)
        });
    }

    _updateTravelSelection(locationId) {
        let routes = this.findRoutesToDestination({
            path: [],
            travelTime: 0,
            currentLocationId: Number(this.props.location.currentLocation.id)
        }, Number(locationId));
        let shortestRoute = routes[0];
        routes.forEach((route) => {
            if (route.travelTime < shortestRoute.travelTime) {
                shortestRoute = route;
            }
        });

        this.setState({
            travelSelection: locationId,
            currentRoute: shortestRoute
        });
    }

    _travelToLocation() {
        let time = new TimeManager();
        this.props.clockTick(time.convertToTick({
            h: this.state.currentRoute.travelTime
        }));
        this.props.changeLocation(Number(this.state.travelSelection));
        this.setState({
            isTravelSelectorVisible: false,
            currentRoute: BLANK_ROUTE
        });
    }

    _printCurrentRouteBreadcrumbs() {
        let style = {
            icon: { 
                fontSize: '12px'
            },
            road: {
                fontSize: '10px'
            }
        }
       if (this.state.currentRoute) {
            let traveler = new Traveler(
               this.props.location.locations, 
               this.props.location.roads, 
               this.props.location.currentLocation.id
            );
            const breadcrumbs = [];
            for (let i = 0; i < this.state.currentRoute.path.length; i++) {
                const roadId = this.state.currentRoute.path[i];
                const road = traveler.traverseRoad(roadId);
                breadcrumbs.push(
                    <div className="breadcrumb">
                        <div className="icon">
                        <FontAwesomeIcon
                                style={style.road}
                                icon="arrow-right"
                        />
                        </div>
                        <div className="label">
                            { road.name }
                        </div>
                    </div>
                )
                const nameLabel = traveler.currentLocation.name;
                breadcrumbs.push(
                   <div className="breadcrumb">
                        <div className="icon">
                            <FontAwesomeIcon
                                style={style.icon}
                                icon="square"
                            />
                        </div>
                        <div className="label">
                            { nameLabel }
                        </div>
                   </div>
               )
           };

           return breadcrumbs;
       }
    }

    render(){
        let travelOptions = this._getTravelOptions(this.props.location.currentLocation?.id);

        if (!this.props.clock.id) {
            // unsaved game state
            return(
                <div className="location-dash-wrapper">
                    <div className="location-dash">
                        <div className="location-dash-tile">
                            Save your game to begin working with locations
                        </div>
                    </div>
                </div>
            );
        } else {
            return(
                <div>
                    {   // general dashboard
                        this.props.location.currentLocation &&
                        <div className="kb-dashboard-tile">
                            <div className="location-dash-tile">
                                <div className="header">
                                    { this.props.location.currentLocation.name }
                                </div>
                            </div>
                            <WeatherTile />
                            <div className="location-dash-tile">
                                <hr/>
                                <div className="kb-text-btn"
                                    onClick={() => {
                                        this.setState({
                                            isTravelSelectorVisible: true,
                                            currentRoute: BLANK_ROUTE
                                        });
                                    }}
                                >
                                    <FontAwesomeIcon
                                        style={{
                                            marginRight: 8
                                        }}
                                        icon="walking"
                                    />
                                    Travel to...
                                </div>
                                <div className="kb-text-btn"
                                    onClick={() => {
                                        this.setState({
                                            isLocationSelectorVisible: true,
                                            displaySetLocationWarning: true
                                        });
                                    }}
                                >
                                    <FontAwesomeIcon
                                        style={{
                                            marginRight: 8
                                        }}
                                        icon="hand-point-right"
                                    />
                                    Set Location
                                </div>
                            </div>
                        </div>
                    }
                    {   // create starting location
                        !this.props.location.currentLocation && this.props.location.locations.length === 0 && 
                        <div className="location-dash">
                            <div className="location-dash-tile">
                                <div className="header">
                                    location dashboard
                                </div>
                                <hr/>
                                <div className="kb-text-btn"
                                    onClick={() => {
                                        this.setState({
                                            isLocationCreatorVisible: true
                                        });
                                    }}
                                >
                                    <FontAwesomeIcon
                                        style={{
                                            marginRight: 8
                                        }}
                                        icon="plus-square"
                                    />
                                    Create Starting Location
                                </div>
                            </div>
                        </div>
                    }
                    {   // select a location
                        !this.props.location.currentLocation && this.props.location.locations.length !== 0 &&
                        <div className="location-dash">
                            <div className="location-dash-tile">
                                <div className="kb-text-btn"
                                    onClick={() => {
                                        this.setState({
                                            isLocationSelectorVisible: true
                                        });
                                    }}
                                >
                                    <FontAwesomeIcon
                                        style={{
                                            marginRight: 8
                                        }}
                                        icon="hand-point-right"
                                    />
                                    Select Location
                                </div>
                            </div>
                        </div>
                    }
                    { 
                        // Modals belows
                    }
                    <KoboldioModal
                        title="Create starting location"
                        visible={this.state.isLocationCreatorVisible}
                        onRequestClose={this._closeLocationCreator}
                    >
                        <LocationCreationForm
                            onSubmit={this._createStartingLocation}
                        />
                    </KoboldioModal>
                    <KoboldioModal
                        title="Select location"
                        visible={this.state.isLocationSelectorVisible}
                        onRequestClose={this._closeLocationSelector}
                    >
                        <div className="modal-wrapper">
                            {
                                this.state.displaySetLocationWarning &&
                                <div className="kb-warning-label">
                                    Warning: Game state will only update if you select <b>Travel</b>.
                                </div>
                            }
                            <select
                                className="kb-select"
                                onChange={(e) => {
                                    this._updateChangeLocationSelection(e.target.value);
                                }}
                            >
                                { this.locationOptions }
                            </select>
                            <div
                                className="kb-text-btn"
                                onClick={this._changeLocation}
                            >
                                <FontAwesomeIcon
                                    style={{
                                        marginRight: 8
                                    }}
                                    icon="hand-point-right"
                                />
                                Set Location
                            </div>
                        </div>
                    </KoboldioModal>
                    <KoboldioModal
                        title="Traveling"
                        visible={this.state.isTravelSelectorVisible}
                        onRequestClose={this._closeTravelSelector}
                    >
                        <div className="modal-wrapper">
                            <div className="header">
                                Travel from { this.props.location?.currentLocation?.name } to...
                            </div>
                            <select
                                className="kb-select"
                                onChange={(e) => {
                                    this._updateTravelSelection(e.target.value);
                                }}
                            >
                                { travelOptions }
                            </select>
                            {
                                this.state.currentRoute.path.length > 0 &&
                                    <div className="travel-breadcrumbs">
                                        {
                                            this._printCurrentRouteBreadcrumbs()
                                        }
                                        <div className="kb-stat-card kb-text-highlight-info">
                                            <div className="value">
                                                { this.state.currentRoute.travelTime }
                                            </div>
                                            <div className="label">
                                                hours to travel
                                            </div>
                                        </div>
                                    </div>
                            }
                            <div
                                className="kb-text-btn"
                                onClick={this._travelToLocation}
                            >
                                <FontAwesomeIcon
                                    style={{
                                        marginRight: 8
                                    }}
                                    icon="walking"
                                />
                                Go!
                            </div>
                        </div>
                    </KoboldioModal>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => ({
    location: state.location,
    clock: state.clock
});

function mapDispatchToProps(dispatch) {
    return {
        createStartingLocation: (location) => dispatch(createStartingLocation(location)),
        changeLocation: (location) => dispatch(changeLocation(location)),
        clockTick: (tick) => dispatch(clockTick(tick))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationDashboard);