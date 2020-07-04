import React, { Component } from 'react';
import {connect} from 'react-redux';
import { calculateEventStack, popEventStack } from '../../redux/actions/calendarActions';
import TimeManager from '../../classes/TimeManager';
import KoboldioModal from '../Generics/KoboldioModal';
import { EVENT_TYPES } from '../../constants/EventConstants';
import ClockTime from '../../models/clock-time';

const _ = require("lodash");

class CalendarDashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            eventStack: [],
            maxTick: Number.MIN_VALUE,
            inspectedEvent: undefined
        };
        
        // members
        this.timeManager = new TimeManager();

        // internal methods
        this._getDateTimeString = this._getDateTimeString.bind(this);
        this._calculateMaxTick = this._calculateMaxTick.bind(this);
        this._launchEventInspector = this._launchEventInspector.bind(this);
        this._closeEventInspector = this._closeEventInspector.bind(this);
        this._getNextEventTime = this._getNextEventTime.bind(this);
        this._evaluateEvents = this._evaluateEvents.bind(this);
    }
    
    componentDidUpdate(prevProps) {
        if ( prevProps.calendar.events !== this.props.calendar.events ||
            prevProps.calendar.recurringEvents !== this.props.calendar.recurringEvents ) {
            this.props.calculateEventStack();
        }

        if (prevProps.calendar.eventStack !== this.props.calendar.eventStack) {
            this.setState({
                maxTick: this._calculateMaxTick(this.props.calendar.eventStack)
            });
        }
    }

    _getDateTimeString(event) {
        return this.timeManager.getCampaignDayTimeString(event);
    }

    _getLocationName(locationId) {
        let location = _.find(this.props.location.locations, {"id": locationId});
        if (location) {
            return location.name;
        } else {
            return '';
        }
    }

    _calculateMaxTick(events) {
        let ticks = _.map(events, (event) => {
            return this.timeManager.convertToTick(event.date);
        });
        return _.max(ticks);
    }

    _launchEventInspector(event) {
        this.setState({
            inspectedEvent: event
        });
    }

    _closeEventInspector(){
        this.setState({
            inspectedEvent: undefined
        });
    }

    _getNextEventTime(event) {
        if (event) {
            this.props.calendar.eventStack.forEach((e) => {
                if (e.id === event.id && e.date !== event.date) {
                    return this.timeManager.getDateTimeString(e.date);
                }
            })
        }
    }

    _evaluateEvents() {
        if (this.props.calendar.eventStack.length > 0) {
            const nextEvent = this.props.calendar.eventStack[0];
            this.timeManager.currentDate = this.props.clock.worldTime;
            if (this.timeManager.isEarlier(nextEvent.date)) {
                if (nextEvent.locationId) {
                    if (nextEvent.locationId === this.props.location.currentLocation.id) {
                        this.setState({
                            inspectedEvent: Object.assign({}, nextEvent)
                        }, () => {
                            this.props.popEventStack();
                            this.props.calculateEventStack();
                        });
                    } else {
                        this.props.popEventStack();
                        this.props.calculateEventStack();
                    }
                } else {
                    this.setState({
                        inspectedEvent: Object.assign({}, nextEvent)
                    }, () => {
                        this.props.popEventStack();
                        this.props.calculateEventStack();
                    })
                }
            }
        }
    }

    render(){
        // evaluate events
        this._evaluateEvents();

        // draw
        const currentTick = this.timeManager.convertToTick(this.props.clock.worldTime);
        let eventCards = [];
        this.props.calendar.eventStack.forEach((event) => {
            const eventTick = this.timeManager.convertToTick(event.date);
            const fillRatio = ((eventTick - currentTick) / (this.state.maxTick - currentTick)) * 100;
            let styles = {
                backgroundFill : {
                    backgroundImage: `linear-gradient(to right, rgba(173, 216, 230, 0.55) 0%, rgba(173, 216, 230, 0.55) ${fillRatio}%, rgba(0,0,0,0) ${fillRatio}%, rgba(0,0,0,0) 100%)`
                }
            };
            eventCards.push(
                <div
                    key={`event-listing-${event.id}-${event.campaignDay}`}
                    className="kb-event-listing"
                    style={styles.backgroundFill}
                    onClick={() => {
                        this._launchEventInspector(event);
                    }}
                >
                    <div className="event-details">
                        { this._getDateTimeString(event) }
                        { event.locationId && <hr /> }
                        { event.locationId && this._getLocationName(event.locationId) }
                    </div>
                    <div className="event-title">
                        { event.name }
                    </div>
                </div>
            );
        });
        
        if (this.props.visible) {
            return(
                <div className="kb-dashboard-tile">
                    <div className="body-tile">
                        <div className="header">
                            upcoming events
                        </div>
                    </div>
                    <div className="body-tile">
                        {
                            eventCards
                        }
                    </div>
                    <KoboldioModal
                        title={this.state.inspectedEvent?.name}
                        onRequestClose={this._closeEventInspector}
                        visible={this.state.inspectedEvent}
                    >
                        <table className="kb-form">
                            <tbody>
                                <tr>
                                    <td colSpan={2} className="kb-emphasized">
                                        Campaign Day { this.state.inspectedEvent?.campaignDay }
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2} className="kb-emphasized">
                                        { this.timeManager.getFormalDateTimeString(this.state.inspectedEvent?.date ?? new ClockTime())}
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                       description 
                                    </th>
                                    <td>
                                        { this.state.inspectedEvent?.description}
                                    </td>
                                </tr>
                                <tr>
                                    {
                                        this.state.inspectedEvent?.locationId &&
                                        <th>
                                            location
                                        </th>
                                    }
                                    {
                                        this.state.inspectedEvent?.locationId &&
                                        <td>
                                            { this._getLocationName(this.state.inspectedEvent?.locationId) }
                                        </td>
                                    }
                                </tr>
                                {
                                    this.state.inspectedEvent?.eventType === EVENT_TYPES.Recurring &&
                                    <tr>
                                        <th>
                                            next event
                                        </th>
                                        <td>
                                            { this._getNextEventTime(this.state.inspectedEvent) }
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </KoboldioModal>
                </div>
            );
        } else {
            return null;
        }
    }
}

const mapStateToProps = (state) => ({
    calendar: state.calendar,
    location: state.location,
    clock: state.clock
});

function mapDispatchToProps(dispatch) {
    return {
        calculateEventStack: () => dispatch(calculateEventStack()),
        popEventStack: () => dispatch(popEventStack())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarDashboard);