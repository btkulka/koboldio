import React, { Component } from 'react';
import { BASE_BIOME_TYPES } from '../constants/WeatherTypes';

export default class LocationCreationForm extends Component {
    constructor(props){
        super(props);

        this.state = {
            locationName: undefined,
            biome: undefined
        };

        // internal methods
        this._updateLocationName = this._updateLocationName.bind(this);
        this._changeBiome = this._changeBiome.bind(this);
        this._submit = this._submit.bind(this);
    }

    _updateLocationName(val) {
        this.setState({
            locationName: val
        });
    }

    _changeBiome(val) {
        this.setState({
            biome: val
        });
    }

    _submit(){
        let location = {
            name: this.state.locationName,
            biome: this.state.biome
        };

        if(this.props.onSubmit) {
            this.props.onSubmit(location);
        } else {
            throw(new Error("No onSubmit() supplied for Location Creation Form."));
        }
    }

    render() {

        let biomeOptions = [];
        Object.keys(BASE_BIOME_TYPES).forEach((key) => {
            let biome = BASE_BIOME_TYPES[key];
            biomeOptions.push(
                <option 
                    className={"kb-select-item" + (this.state.biome === key ? 'kb-select-item-selected' : '')}
                    value={key}
                    selected={this.state.biome === key}
                >
                    {biome.name}
                </option>
            );
        })

        return(
            <div className="kb-table">
                <div className="kb-row">
                    <div className="kb-col">
                        Name
                    </div>
                    <div className="kb-col">
                        Biome
                    </div>
                </div>
                <div className="kb-row">
                    <div className="kb-col">
                        <input 
                            type="text"
                            className="kb-input"
                            placeholder="location name..."
                            value={this.state.locationName}
                            onChange={(e) => {
                                this._updateLocationName(e.target.value);
                            }}
                        ></input>
                    </div>
                    <div className="kb-col">
                        <select
                            className="kb-select"
                            onChange={(e) => {
                                this._changeBiome(e.target.value);
                            }}
                            >
                            { biomeOptions }
                        </select>
                    </div>
                </div>
                <div className="kb-row">
                    <div className="kb-col">
                        <div className="kb-text-btn"
                            onClick={this._submit}
                        >
                            Create
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}