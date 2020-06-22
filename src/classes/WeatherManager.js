import { BASE_LOCATION } from "../constants/Locations";
import { PRECIPITATION_STATES } from "../constants/WeatherTypes";

export default class WeatherManager {
    constructor(location = BASE_LOCATION){

        // + or - 10%
        let baseTempFlux = location.biome.averageTemp * ((Math.random() * 0.2) - 0.1);

        this.state = {
            location: location,
            temperature: Math.round(location.biome.averageTemp + baseTempFlux, 2),
            precipitationState: PRECIPITATION_STATES.Sunny
        };

        // internal methods
        this._tickWeatherState = this._tickWeatherState.bind(this);
    }

    // Getters / Setters
    // ===================================

    // retrieves temperature based on 
    get temperature(){
        return this.state.temperature;
    }
    
    // Internal methods
    // ====================================

    _tickWeatherState(){

    }
}