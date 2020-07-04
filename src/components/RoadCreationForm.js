import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';

class RoadCreationForm extends Component {
    constructor(props){
        super(props);

        this.state = {
            roadName: undefined,
            location1Id: undefined,
            location2Id: undefined,
            travelTime: undefined,
            isTravelTimeDirty: false
        };

        // internal methods
        this._updateRoadName = this._updateRoadName.bind(this);
        this._selectFirstLocation = this._selectFirstLocation.bind(this);
        this._selectSecondLocation = this._selectSecondLocation.bind(this);
        this._updateTravelTime = this._updateTravelTime.bind(this);
        this._submit = this._submit.bind(this);
        this._cancel = this._cancel.bind(this);
    }

    componentDidMount() {
        this.setState({
            location1Id: this.props.location.locations[0].id,
            location2Id: this.props.location.locations[1].id
        });
    }

    get isValid() {
        return(
            this.state.roadName && 
            this.state.location1Id && 
            this.state.location2Id && 
            this.state.travelTime 
            && !this.state.isTravelTimeDirty
        );
    }

    _updateRoadName(val) {
        this.setState({
            roadName: val
        });
    }

    _updateTravelTime(val) {
        this.setState({
            isTravelTimeDirty: isNaN(val),
            travelTime: val
        });
    }

    _selectFirstLocation(locationId) {
        this.setState({
            location1Id: Number(locationId)
        });
    }

    _selectSecondLocation(locationId) {
        this.setState({
            location2Id: Number(locationId)
        });
    }

    _submit(){
        let road = {
            name: this.state.roadName,
            location1Id: this.state.location1Id,
            location2Id: this.state.location2Id,
            travelTime: this.state.travelTime
        };

        if(this.props.onSubmit) {
            this.props.onSubmit(road);
        } else {
            throw(new Error("No onSubmit() supplied for Road Creation Form."));
        }
    }

    _cancel() {
        if (this.props.onCancel) {
            this.props.onCancel();
        } else {
            throw(new Error("No onCancel() supplied for Road Creation Form."));
        }
    }

    render() {

        let location1Options = [];
        this.props.location.locations.forEach((location) => {
            if (this.state.location2Id !== location.id) {
                // remove location if it's already selected
                location1Options.push(
                    <option
                        key={'location-1-' + location.id}
                        className="kb-select-item"
                        value={location.id}
                    >
                        {location.name}
                    </option>
                );
            }
        });

        let location2Options = [];
        this.props.location.locations.forEach((location) => {
            if (this.state.location1Id !== location.id) {
                // remove location if it's already selected
                location2Options.push(
                    <option
                        key={'location-2-' + location.id}
                        className="kb-select-item"
                        value={location.id}
                    >
                        {location.name}
                    </option>
                );
            }
        })

        return(
            <div>
                <h3>Create a road</h3>
                <div className="kb-table">
                    <div className="kb-row">
                        <div className="kb-col">
                            Name
                        </div>
                        <div className="kb-col">
                            1st location
                        </div>
                        <div className="kb-col">
                            2nd location
                        </div>
                        <div className="kb-col">
                            Travel time
                        </div>
                    </div>
                    <div className="kb-row">
                        <div className="kb-col">
                            <input 
                                type="text"
                                className="kb-input"
                                placeholder="road name..."
                                value={this.state.roadName}
                                onChange={(e) => {
                                    this._updateRoadName(e.target.value);
                                }}
                            ></input>
                        </div>
                        <div className="kb-col">
                            <select
                                defaultValue={this.state.location1Id}
                                className="kb-select"
                                onChange={(e) => {
                                    this._selectFirstLocation(e.target.value);
                                }}
                                >
                                { location1Options }
                            </select>
                        </div>
                        <div className="kb-col">
                            <select
                                defaultValue={this.state.location2Id}
                                className="kb-select"
                                onChange={(e) => {
                                    this._selectSecondLocation(e.target.value);
                                }}
                                >
                                { location2Options }
                            </select>
                        </div>
                        <div className="kb-col">
                            <input
                                type="text"
                                className={"kb-input " + (this.state.isTravelTimeDirty ? 'kb-dirty' : '')}
                                placeholder="(in hours)"
                                value={this.state.travelTime}
                                onChange={(e) => {
                                    this._updateTravelTime(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="kb-row">
                        <div className="kb-col kb-tray">
                            <div className={"kb-text-btn " + (!this.isValid ? 'disabled' : '')}
                                onClick={() => {
                                    if (this.isValid) {
                                        this._submit(); 
                                    }
                                }}
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

const mapStateToProps = (state) => ({
    location: state.location
});

function mapDispatchToProps(dispatch){
    return {

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RoadCreationForm);