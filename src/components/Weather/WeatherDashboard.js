import React, { Component } from 'react';
import './WeatherDashboard.css';
import {connect} from 'react-redux';
import WeatherManager from '../../classes/WeatherManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import KoboldioModal from '../Generics/KoboldioModal';
import LocationCreationForm from '../LocationCreationForm';
import { createStartingLocation } from '../../redux/actions/locationActions';

class WeatherDashboard extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLocationCreatorVisible: false,
            weather: new WeatherManager(this.props.location.currentLocation)
        };

        // internal methods
        this._closeLocationCreator = this._closeLocationCreator.bind(this);
        this._createStartingLocation = this._createStartingLocation.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.setState({
                weatherManager: new WeatherManager(this.props.location.currentLocation)
            });
        }
    }

    _closeLocationCreator() {
        this.setState({
            isLocationCreatorVisible: false
        });
    }

    async _createStartingLocation(location) {
        debugger;
        location.clockId = this.props.clock.id;
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
        });
    }

    render(){
        return(
            <div className="weather-dash-wrapper">
                <div className="weather-dash">
                    {
                        this.props.location.currentLocation &&
                        <div className="weather-dash-tile">
                            <div className="header">
                                { this.props.location.currentLocation.name }
                            </div>
                            <hr/>
                            <div className="subheader">
                                temp. { Math.round(this.state.weather.temperature, 2) }&deg;F
                            </div>
                        </div>
                    }
                    {
                        !this.props.location.currentLocation &&
                        <div className="weather-dash-tile">
                            <div className="header">
                                weather
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
                                Add Starting Location
                            </div>
                        </div>
                    }
                </div>
                <KoboldioModal
                    title="Create starting location"
                    visible={this.state.isLocationCreatorVisible}
                    onRequestClose={this._closeLocationCreator}
                >
                    <LocationCreationForm
                        onSubmit={this._createStartingLocation}
                    />
                </KoboldioModal>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    location: state.location,
    clock: state.clock
});

function mapDispatchToProps(dispatch) {
    return {
        createStartingLocation: (location) => dispatch(createStartingLocation(location))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(WeatherDashboard);