import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PRECIPITATION_STATES } from '../../constants/WeatherTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TEMP_DISPLAY_MODES = {
    Precise: 0,
    Expanded: 1
}

const SKY_DISPLAY_MODES = {
    Description: 0,
    Chance: 1
}

class WeatherTile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            skyIcon: 'sun',
            skies: PRECIPITATION_STATES.Sunny,
            tempDisplay: TEMP_DISPLAY_MODES.Precise,
            skyDisplay: SKY_DISPLAY_MODES.Description,
            rainChance: 0
        }

        // methods
        this.calculateSkies = this.calculateSkies.bind(this);
        this.toggleTempDisplay = this.toggleTempDisplay.bind(this);
        this.toggleSkyDisplay = this.toggleSkyDisplay.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.weather !== this.props.weather) {
            this.calculateSkies();
        }
    }

    toggleTempDisplay() {
        if (this.state.tempDisplay === TEMP_DISPLAY_MODES.Expanded) {
            this.setState({
                tempDisplay: TEMP_DISPLAY_MODES.Precise
            });
        } else {
            this.setState({
                tempDisplay: TEMP_DISPLAY_MODES.Expanded
            });
        }
    }

    toggleSkyDisplay() {
        if (this.state.skyDisplay === SKY_DISPLAY_MODES.Chance) {
            this.setState({
                skyDisplay: SKY_DISPLAY_MODES.Description
            });
        } else {
            this.setState({
                skyDisplay: SKY_DISPLAY_MODES.Chance
            });
        }
    }

    calculateSkies() {
        let chance = this.props.weather.globalPrecipitation + this.props.weather.localPrecipitation;
        let description;
        let skyIcon;
        if (chance < 0.25) {
            description = PRECIPITATION_STATES.Clear;
            skyIcon = "sun";
        } else if (chance < 0.5) {
            description = PRECIPITATION_STATES.Overcast;
            skyIcon = "cloud-sun";
        } else if (chance < 0.6) {
            description = PRECIPITATION_STATES.Cloudy;
            skyIcon = "cloud";
        } else if (chance < 0.7) {
            description = PRECIPITATION_STATES.Drizzling;
            skyIcon = "cloud-sun-rain";
        } else if (chance < 0.8) {
            description = PRECIPITATION_STATES.Precipitating;
            skyIcon = "cloud-showers-heavy"
        } else if (chance < 0.9) {
            description = PRECIPITATION_STATES.Storming;
            skyIcon = "bolt";
        } else {
            description = PRECIPITATION_STATES.Cataclysmic;
            skyIcon = "exclamation-triangle";
        }

        this.setState({
            skies: description,
            skyIcon: skyIcon,
            rainChance: Number(chance)
        });
    }

    render() {
        return(
            <div className="location-dash-tile">
                <div className="subheader">
                    Weather
                    <FontAwesomeIcon
                        icon={this.state.skyIcon}
                    />
                </div>
                <div className="listing-pair">
                    <div className="key">
                        Temp.
                    </div>
                    <div 
                        className="value"
                        onClick={this.toggleTempDisplay}
                    >
                        {   this.state.tempDisplay === TEMP_DISPLAY_MODES.Precise &&
                            Math.round(
                            this.props.weather.globalTemp + 
                            this.props.weather.localTemp +
                            this.props.weather.clockTemp +
                            this.props.weather.seasonalTemp)
                        } 
                        {
                            this.state.tempDisplay === TEMP_DISPLAY_MODES.Expanded &&
                            Math.round(
                                (this.props.weather.globalTemp + 
                                this.props.weather.localTemp +
                                this.props.weather.clockTemp +
                                this.props.weather.seasonalTemp) * 100) / 100
                        }
                        &deg;F
                    </div>
                </div>
                <div className="listing-pair">
                    <div className="key">
                        {
                            this.state.skyDisplay === SKY_DISPLAY_MODES.Description &&
                            "Skies"
                        }
                        {
                            this.state.skyDisplay === SKY_DISPLAY_MODES.Chance &&
                            "Chance of rain"
                        }
                    </div>
                    <div
                        className="value"
                        onClick={this.toggleSkyDisplay}
                    >
                        { 
                            this.state.skyDisplay === SKY_DISPLAY_MODES.Description &&
                            this.state.skies 
                        }
                        {
                            this.state.skyDisplay === SKY_DISPLAY_MODES.Chance &&
                            (Math.round(this.state.rainChance * 10000) / 100) + "%"
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    weather: state.weather
});

export default connect(mapStateToProps, {})(WeatherTile);