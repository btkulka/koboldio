import React, { Component } from 'react';
import './WeatherDashboard.css';
import {connect} from 'react-redux';
import WeatherManager from '../../classes/WeatherManager';

class WeatherDashboard extends Component {
    constructor(props){
        super(props);

        this.state = {
            weather: new WeatherManager(this.props.location.currentLocation)
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.setState({
                weatherManager: new WeatherManager(this.props.location.currentLocation)
            });
        } else if (this.props.clock !== prevProps.clock) {
            this._tickWeatherState();
        }
    }

    _tickWeatherState() {
        
    }

    render(){
        return(
            <div className="weather-dash-wrapper">
                <div className="weather-dash">
                    <div className="weather-dash-tile">
                        <div className="header">
                            { this.props.location.currentLocation.name }
                        </div>
                        <hr/>
                        <div className="subheader">
                            temp. { Math.round(this.state.weather.temperature, 2) }&deg;F
                        </div>
                    </div>
                </div>
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

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(WeatherDashboard);