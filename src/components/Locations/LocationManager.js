import React, { Component } from 'react';
import { connect } from 'react-redux';
import KoboldioAccordionFolder from '../Generics/KoboldioAccordionFolder';
import LocationCreationForm from '../LocationCreationForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    addLocation, 
    removeLocation, 
    connectRoad,
    removeRoad,
    addRoad
} from '../../redux/actions/locationActions';
import RoadCreationForm from '../RoadCreationForm';

class LocationManager extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isCreatingLocation: false,
            isBuildingRoad: false
        };

        // internal methods
        this._openCreationForm = this._openCreationForm.bind(this);
        this._cancelLocationCreation = this._cancelLocationCreation.bind(this);
        this._openBuildRoadForm = this._openBuildRoadForm.bind(this);
        this._createLocation = this._createLocation.bind(this);
        this._deleteLocation = this._deleteLocation.bind(this);
        this._createRoad = this._createRoad.bind(this);
        this._deleteRoad = this._deleteRoad.bind(this);
        this._cancelRoadCreation = this._cancelRoadCreation.bind(this);
        this._formatLabel = this._formatLabel.bind(this);
    }

    _openCreationForm(){
        this.setState({
            isCreatingLocation: true
        });
    }

    _cancelLocationCreation() {
        this.setState({
            isCreatingLocation: false
        });
    }
    
    _openBuildRoadForm() {
        this.setState({
            isBuildingRoad: true
        });
    }

    _cancelRoadCreation() {
        this.setState({
            isBuildingRoad: false
        });
    }

    async _createRoad(road) {
        road.clockId = this.props.clock.id
        await fetch(`http://localhost:3401/roads`, {
            method: 'POST',
            body: JSON.stringify(road),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then((data) => {
            road.id = data.id;
            this.props.addRoad(road);
            this.props.connectRoad(road);
            this.setState({
                isBuildingRoad: false
            });
        });
    }
    
    async _deleteRoad(road) {
        this.props.removeRoad(road);
        await fetch(`http://localhost:3401/roads/${road.id}`);
    }

    async _deleteLocation(item) {
        // delete all roads
        if (item.roads) {
            item.roads.forEach(async (road) => {
                await this._deleteRoad(road);
            });
        }
        
        // delete location
        await fetch(`http://localhost:3401/locations/${item.id}`, {
            method: 'DELETE'
        }).then(() => {
            this.props.removeLocation(item);
        })
    }

    async _createLocation(location){
        location.clockId = this.props.clock.id;
        location.roads = [];
        await fetch("http://localhost:3401/locations", {
            method: 'POST',
            body: JSON.stringify(location),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then((data) => {
            location.id = data.id;
            this.props.addLocation(location);
            this.setState({
                isCreatingLocation: false
            });
        });
    }

    _formatLabel(label) {
        const labelsToReformat = {
            'travelTime': 'travel (hrs)',
            'to': 'dest.'
        };

        if (labelsToReformat[label] !== undefined){
            return labelsToReformat[label];
        } else {
            return label;
        }
    }

    render() {
        const filterValues = ['id', 'clockId', 'type'];
        let data = this.props.location.locations;
        data.forEach((location) => {
            location.type = 'location';
            if (location.roads) {
                location.roads.forEach((road) => {
                    road.type = 'road'
                });
            }
        });

        if (this.props.visible) {
            return(
                <div className="kb-resource-manager">
                    <div className="title-box">
                        <div>
                            <h1>
                                Locations
                            </h1>
                        </div>
                        {
                            !this.state.isCreatingLocation && !this.state.isBuildingRoad &&
                            <div className="button-box">
                                <div onClick={this._openCreationForm}>
                                    <div className="kb-text-btn">
                                        <FontAwesomeIcon
                                            className="icon"
                                            icon="plus-square"
                                        />
                                        <span>
                                            Create New Location
                                        </span>
                                    </div>
                                </div>
                                <div onClick={this._openBuildRoadForm}>
                                    <div 
                                        className={"kb-text-btn " + (this.props.location.locations.length > 1 ? '' : 'disabled')}
                                    >
                                        <FontAwesomeIcon
                                            className="icon"
                                            icon="plus-square"
                                        />
                                        <span>
                                            Build Road
                                        </span>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="form-box">
                        {
                            this.state.isCreatingLocation &&
                            <LocationCreationForm
                                onSubmit={this._createLocation}
                                onCancel={this._cancelLocationCreation}
                            />
                        }
                        {
                            this.state.isBuildingRoad &&
                            <RoadCreationForm
                                onSubmit={this._createRoad}
                                onCancel={this._cancelRoadCreation}
                            />
                        }
                    </div>
                    <div>
                        {
                            this.props.location.locations.length > 0 &&
                            <KoboldioAccordionFolder
                                topLevelKey="name"
                                data={data}
                                labelFormatter={this._formatLabel}
                                config={{
                                    filterValues: filterValues,
                                    itemKeys: {
                                        'road': 'name'
                                    },
                                    onDelete: {
                                        'location': this._deleteLocation,
                                        'road': this._deleteRoad
                                    }
                                }}
                            />
                        }
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

const mapStateToProps = (state) => ({
    location: state.location,
    clock: state.clock
});

function mapDispatchToProps(dispatch) {
    return {
        addLocation: (location) => dispatch(addLocation(location)),
        removeLocation: (location) => dispatch(removeLocation(location)),
        addRoad: (road) => dispatch(addRoad(road)),
        connectRoad: (road) => dispatch(connectRoad(road)),
        removeRoad: (road) => dispatch(removeRoad(road))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationManager);