import React, { Component } from 'react';
import { BASE_BIOME_TYPES } from '../constants/WeatherTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class LocationCreationForm extends Component {
    constructor(props){
        super(props);

        this.state = {
            locationName: undefined,
            biome: "Plains"     // default
        };

        // internal methods
        this._updateLocationName = this._updateLocationName.bind(this);
        this._changeBiome = this._changeBiome.bind(this);
        this._submit = this._submit.bind(this);
        this._cancel = this._cancel.bind(this);
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

    _cancel() {
        this.props.onCancel();
    }

    render() {

        let biomeOptions = [];
        Object.keys(BASE_BIOME_TYPES).forEach((key) => {
            let biome = BASE_BIOME_TYPES[key];
            biomeOptions.push(
                <option
                    key={'biome-' + biome.name}
                    className="kb-select-item"
                    value={key}
                >
                    {biome.name}
                </option>
            );
        })

        return(
            <div>
                <h3>Create a location</h3>
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
                                defaultValue={this.state.biome}
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
                        <div className="kb-col kb-tray">
                            <div className="kb-text-btn"
                                onClick={this._submit}
                            >
                                <FontAwesomeIcon
                                    className="icon"
                                    icon="plus-square"
                                />
                                <span>
                                    Create
                                </span>
                            </div>
                            <div className="kb-text-btn"
                                onClick={this._cancel}
                            >
                                <FontAwesomeIcon
                                    className="icon"
                                    icon="ban"
                                />
                                <span>
                                    Cancel
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}