import React, { Component } from 'react';
import KoboldioModal from '../Generics/KoboldioModal';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class CalendarManager extends Component {
    constructor(props){
        super(props);

        this.state = {
            visible: false
        };

        // internal methods
        this._hide = this._hide.bind(this);
    }

    // Lifecycle functions
    // =======================

    componentDidUpdate(prevProps){
        if (this.props.visible !== prevProps.visible) {
            this.setState({
                visible: this.props.visible
            });
        }
    }

    // Internal methods
    // =======================

    _hide(){
        this.setState({
            visible: false
        }, () => {
            this.props.onHide(this.state.visible);
        });
    }

    render(){
        return(
            <KoboldioModal
                title="Calendar"
                onRequestClose={this._hide}
                visible={this.state.visible}
            >
                <div className="header">
                    Events
                    <div className="kb-text-btn" style={{margin: '8px'}}>
                        <FontAwesomeIcon
                            icon="plus-square"
                            style={{
                                marginRight: '8px'
                            }}
                        />
                        Create Event
                    </div>
                </div>
                <hr/>
                <div className="header">
                    Recurring events
                    <div className="kb-text-btn" style={{margin: '8px'}}>
                        <FontAwesomeIcon
                            icon="plus-square"
                            style={{
                                marginRight: '8px'
                            }}
                        />
                        Create Recurring Event
                    </div>
                </div>
            </KoboldioModal>
        )
    }
}

const mapStateToProps = (state) => ({
    calendar: state.calendar
});

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarManager);