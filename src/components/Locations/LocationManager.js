import React, { Component } from 'react';
import { connect } from 'react-redux';
import './LocationManager.css';
import KoboldioAccordionFolder from '../Generics/KoboldioAccordionFolder';
import LocationCreationForm from '../LocationCreationForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addLocation } from '../../redux/actions/locationActions';

class LocationManager extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isCreatingLocation: false
        };

        // internal methods
        this._openCreationForm = this._openCreationForm.bind(this);
        this._createLocation = this._createLocation.bind(this);
    }

    _openCreationForm(){
        this.setState({
            isCreatingLocation: true
        });
    }

    async _createLocation(location){
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
            this.props.addLocation(location);
            this.setState({
                isCreatingLocation: false
            });
        });
    }

    render() {
        if (this.props.visible) {
            return(
                <div className="main">
                    <div className="title-box">
                        <div>
                            <h1>
                                Locations
                            </h1>
                        </div>
                        {
                            !this.state.isCreatingLocation &&
                            <div onClick={this._openCreationForm}>
                                <div className="kb-text-btn">
                                    <FontAwesomeIcon
                                        style={{
                                            marginRight: 8
                                        }}
                                        icon="plus-square"
                                    />
                                    Create New Location
                                </div>
                            </div>
                        }
                        {
                            this.state.isCreatingLocation &&
                            <LocationCreationForm
                                onSubmit={this._createLocation}
                            />
                        }
                    </div>
                    <div>
                        {
                            this.props.location.locations.length > 0 &&
                            <KoboldioAccordionFolder
                                topLevelKey="name"
                                data={this.props.location.locations}
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
        addLocation: (location) => dispatch(addLocation(location))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationManager);