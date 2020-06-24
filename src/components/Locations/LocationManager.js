import React, { Component } from 'react';
import { connect } from 'react-redux';
import './LocationManager.css';
import KoboldioAccordionFolder from '../Generics/KoboldioAccordionFolder';
import LocationCreationForm from '../LocationCreationForm';

class LocationManager extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isCreatingLocation: false
        };

    }

    render() {
        if (this.props.visible) {
            return(
                <div className="main">
                    <div className="title-box">
                        <h1>
                            Locations
                        </h1>
                    </div>
                    {
                        !this.state.isCreatingLocation &&
                        <div>
                            {
                                this.props.location.locations.length > 0 &&
                                <KoboldioAccordionFolder
                                    topLevelKey="name"
                                    data={this.props.location.locations}
                                />
                            }
                            <div className="kb-text-btn">
                                Create New Location
                            </div>
                        </div>
                    }
                    {
                        this.state.isCreatingLocation &&
                        <LocationCreationForm
                            onSubmit={() => {
                                
                            }}
                        />
                    }
                </div>
            );
        } else {
            return null;
        }
    }
}

const mapStateToProps = (state) => ({
    location: state.location
});

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationManager);