import { BASE_LOCATION } from "../constants/Locations";
import { PRECIPITATION_STATES, BASE_BIOME_TYPES } from "../constants/WeatherTypes";

export default class WeatherManager {
    constructor(location = BASE_LOCATION){
        let biome = BASE_BIOME_TYPES[location.biome];
        // + or - 10%
        let baseTempFlux = biome.averageTemp * ((Math.random() * 0.2) - 0.1);

        this.state = {
            location: location,
            temperature: Math.round(biome.averageTemp + baseTempFlux, 2),
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