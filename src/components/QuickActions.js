import React, { Component } from 'react';
import './QuickActions.css';
import ShortRestIcon from '../assets/imgs/short-rest-icon.png'
import LongRestIcon from '../assets/imgs/long-rest-icon.png'
import TimeIcon from '../assets/imgs/time-icon.png'
import TravelIcon from '../assets/imgs/travel-icon.png'
import KoboldioModal from './Generics/KoboldioModal';
import KoboldioTimeInput from './Generics/KoboldioTimeInput';
import { connect } from 'react-redux';
import ClockTime from '../models/clock-time';
import TimeManager from '../classes/TimeManager';
import { clockTick } from '../redux/actions/clockActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class QuickActions extends Component {
    constructor(props){
        super(props);

        this.state = {
            isPassingTime: false,
            timeToPass: new ClockTime()
        };

        // members
        this._timeManager = new TimeManager();

        // internal methods
        this._longRest = this._longRest.bind(this);
        this._shortRest = this._shortRest.bind(this);
        this._updateTimeToPass = this._updateTimeToPass.bind(this);
        this._passTime = this._passTime.bind(this);
    }

    _longRest() {
        this.props.manipulateTime({
            h: 8
        });
    }

    _shortRest() {
        this.props.manipulateTime({
            h: 1
        });
    }

    _travel() {
        this.props.manipulateTime({

        });
    }

    _updateTimeToPass(time) {
        this.setState({
            timeToPass: time
        });
    }

    _passTime() {
        const tick = this._timeManager.convertToTick(this.state.timeToPass);
        this.props.clockTick(tick);
        this.setState({
            isPassingTime: false,
            timeToPass: new ClockTime()
        });
    }

    render(){
        return(
            <div className="quick-actions-main">
                <div className="action-bubble" onClick={this._shortRest} title="Short Rest">
                    <img alt="short-rest" src={ShortRestIcon} className="action-icon" />
                </div>
                <div className="action-bubble" onClick={this._longRest} title="Long Rest">
                    <img alt="long-rest" src={LongRestIcon} className="action-icon" />
                </div>
                <div className="action-bubble" title="Travel">
                    <img alt="travel" src={TravelIcon} className="action-icon"/>
                </div>
                <div className="action-bubble" title="Pass Time" onClick={() => {
                    this.setState({
                        isPassingTime: true
                    });
                }}>
                    <img alt="pass-time" src={TimeIcon} className="action-icon" />
                </div>
                <KoboldioModal
                    title="Pass time"
                    onRequestClose={(visible) => {
                        this.setState({
                            isPassingTime: visible
                        });
                    }}
                    visible={this.state.isPassingTime}
                >
                    <div className="header">
                        How much time would you like to pass?
                    </div>
                    <KoboldioTimeInput
                        value={this.state.timeToPass}
                        onChange={this._updateTimeToPass}
                    />
                    <div className="kb-text-btn"
                        onClick={this._passTime}
                    >
                        <FontAwesomeIcon
                            style={{
                                marginRight: '8px'
                            }}
                            icon="clock"
                        />
                        Pass Time
                    </div>
                </KoboldioModal>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    
});

function mapDispatchToProps(dispatch) {
    return {
        clockTick: (tick) => dispatch(clockTick(tick))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(QuickActions);