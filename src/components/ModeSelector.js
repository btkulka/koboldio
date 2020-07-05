import React, { Component } from 'react';
import './ModeSelector.css';
import { connect } from 'react-redux';
import TIME_MODES from '../constants/TimeModes';
import { changeTimeMode } from '../redux/actions/clockActions';

class ModeSelector extends Component {
    constructor(props){
        super(props);

        this.state = { }

        this._makeSelection = this._makeSelection.bind(this);
    }

    _makeSelection(mode) {
        this.props.changeTimeMode(mode);
    }

    render() {

        let options = [];
        Object.keys(TIME_MODES).forEach((mode) => {
            let className = "pill";
            if (TIME_MODES[mode] === this.props.clock.mode) {
                className += "-selected";
            }
            options.push(
                <div
                    key={mode}
                    className={className}
                    onClick={() => {
                        this._makeSelection(TIME_MODES[mode]);
                    }}
                >
                    <p>
                        { TIME_MODES[mode] }
                    </p>
                </div>
            );
        })

        return(
            <div className="mode-selector-main">
                <div className="option-bar">
                    {
                        options
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    clock: state.clock
});

function mapDispatchToProps(dispatch) {
    return {
        changeTimeMode: (mode) => dispatch(changeTimeMode(mode))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ModeSelector);