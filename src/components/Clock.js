import React, { Component } from 'react';
import './Clock.css';
import ModeSelector from './ModeSelector';
import QuickActions from './QuickActions';
import { connect } from 'react-redux';
import { manipulateTime, clockTick, changeTimeMode, changeTitle } from '../redux/actions/clockActions';
import TIME_MODES from '../constants/TimeModes';
import CalendarNamesManager from '../classes/CalendarNamesManager';
import TimeManager from '../classes/TimeManager';

class Clock extends Component {

    // Constructor
    // ================================

    constructor(props) {
        super(props);

        this.state = { 
            isEditingTitle: false
        };

        // class members
        this._calendarNamesManager = new CalendarNamesManager();
        this._timeManager = new TimeManager();

        // internal methods
        this._tick = this._tick.bind(this);
        this._editTitle = this._editTitle.bind(this);
        this._handleKeys = this._handleKeys.bind(this);
        this._handleClick = this._handleClick.bind(this);
        
        // public methods
        this.onModeChanged = this.onModeChanged.bind(this);
        this.manipulateTime = this.manipulateTime.bind(this);
        this.load = this.load.bind(this);

        // references
        this.titleInput = React.createRef();
    }

    // Getters/Setters
    // =================================
    get time() {
        const time = this.props.clock.worldTime;
        const hour = String(time.h).padStart(2, '0');
        const minute = String(time.m).padStart(2, '0');
        const second = String(time.s).padStart(2, '0');

        const timeString = String(hour + ":" + minute + ":" + second);
        return timeString.split('');
    }

    get timeModes() {
        let modes = [];

        for(var key in TIME_MODES){
            modes.push(TIME_MODES[key]);
        }

        return modes;
    }

    get nextEvents() {
        return [];
    }

    // Lifecycle Methods
    // =================================

    componentDidMount(){
        this._tick();
        document.addEventListener("keydown", this._handleKeys);
        document.addEventListener("mousedown", this._handleClick);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this._handleKeys);
        document.removeEventListener("mousedown", this._handleClick);
    }

    // Public methods
    // =================================
    onModeChanged(mode) {
        this.props.changeTimeMode(mode);
    }

    manipulateTime(time) {
        let tick = this._timeManager.convertToTick(time);
        this.props.clockTick(tick);
    }

    load(gameData) {
        this.setState(gameData);
    }

    // Internal Methods
    // =================================

    _getOrdinal(n) {
        const lastDigit = n % 10;
        switch(lastDigit){
            case 1:
                return n + 'st';
            case 2:
                return n + 'nd';
            case 3:
                return n + 'rd';
            default:
                return n + 'th';
        }
    }
    
    _tick(tick = 0, ) {
        switch(this.props.clock.mode){
            case TIME_MODES.RealTime:
                tick = 1000;
                break;
            case TIME_MODES.Battle:
                tick = 100;
                break;
            case TIME_MODES.GameTime:
                tick = 2500;
                break;
            default:
                tick = 0;
                break;
        }

        this.props.clockTick(tick);
        setTimeout(this._tick, 1000);
    }

    _editTitle(title){
        this.setState({
            editTitle: title
        });
    }

    _handleKeys(e) {
        const confirmKeys = [13]; // return
        if (this.state.isEditingTitle) {
            if (confirmKeys.includes(e.keyCode)) {  
                // submit title change
                this.setState({
                    isEditingTitle: false
                }, () => {
                    this.props.changeTitle(this.state.editTitle);
                });
            }
        }
    }

    _handleClick(e) {
        if (this.state.isEditingTitle) {
            if (this.titleInput && !this.titleInput.current.contains(e.target)) {
                this.titleInput.current.blur();
                // cancel title change
                this.setState({
                    isEditingTitle: false
                });
            }
        }
    }

    // Render
    // ==============================

    render() {

        let clockDigits = [];
        let clockDigitIndex = 0;
        this.time.forEach((char) => {
            clockDigits.push(
                <div key={"clock-digit-" + clockDigitIndex} className="clock-digit">
                    { char }
                </div>
            );
            clockDigitIndex += 1;
        })

        return(
            <div className="app">
                <div className="clock-main">
                    <div className="content-panel">
                        {
                            !this.state.isEditingTitle &&
                            <div className="clock-title" onClick={() => {
                                this.setState({
                                    isEditingTitle: true
                                }, () => {
                                    this.titleInput.current.select();
                                });
                            }}>
                                { this.props.clock.campaignName }
                            </div>
                        }
                        {
                            this.state.isEditingTitle &&
                            <input
                                ref={this.titleInput}
                                className="clock-title-input" 
                                type="text" 
                                name="title" 
                                value={this.state.editTitle} 
                                placeholder="enter campaign name..."
                                onChange={(e) => this._editTitle(e.target.value)}
                            />
                        }
                        <div className="header">
                            <p>Day 
                                <b> { 
                                    this.props.clock.campaignDay 
                                }</b> | 
                                <b> { 
                                    this._calendarNamesManager.getWeekday(this.props.clock.campaignDay % 7)
                                }</b>, the 
                                <b> { 
                                    this._getOrdinal(this.props.clock.worldTime.d) 
                                }</b> day of 
                                <b> { 
                                    this._calendarNamesManager.getMonth(this.props.clock.worldTime.month)
                                }</b>
                            </p>
                        </div>
                        <div className="clock-wrapper">
                            {
                                clockDigits
                            }
                        </div>
                        <div className="footer">
                            <p>
                                <b> {
                                    this._calendarNamesManager.getSeasonByMonth(this.props.clock.worldTime.month)
                                }</b>, Year
                                <b> {
                                    this.props.clock.worldTime.y
                                }</b>
                            </p>
                        </div>
                        <ModeSelector
                            title='Time mode'
                            onSelectionMade={this.onModeChanged}
                            modes={this.timeModes}
                        />
                        <QuickActions
                            manipulateTime={this.manipulateTime}
                        />
                    </div>
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
        manipulateTime: timeChange => dispatch(manipulateTime(timeChange)),
        clockTick: tickValue => dispatch(clockTick(tickValue)),
        changeTimeMode: mode => dispatch(changeTimeMode(mode)),
        changeTitle: title => dispatch(changeTitle(title))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Clock);