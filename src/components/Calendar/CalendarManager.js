import React, { Component } from 'react';
import { connect } from 'react-redux';
import KoboldioAccordionFolder from '../Generics/KoboldioAccordionFolder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EventCreationForm from '../Forms/EventCreationForm';
import { addEvent, removeEvent } from '../../redux/actions/calendarActions';
import CalendarClient from '../../clients/CalendarClient';
import TimeManager from '../../classes/TimeManager';
import { EVENT_TYPES } from '../../constants/EventConstants';

class CalendarManager extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isCreatingEvent: false
        };

        // members
        this.calendarClient = new CalendarClient();
        this.timeManager = new TimeManager();

        // internal methods
        this._openEventCreationForm = this._openEventCreationForm.bind(this);
        this._closeCreationForm = this._closeCreationForm.bind(this);
        this._formatLabel = this._formatLabel.bind(this);
        this._createEvent = this._createEvent.bind(this);
        this._deleteEvent = this._deleteEvent.bind(this);
    }

    _openEventCreationForm() {
        this.setState({
            isCreatingEvent: true
        });
    }

    _formatLabel(label) {
        const labelsToReformat = {
            'eventType': 'recurrence',
            'dateType': 'trigger',
            'isAllDay': 'Full Day?',
            'length': 'length (hrs)',
            'campaignDay': 'campaign day'
        };

        if (labelsToReformat[label] !== undefined){
            return labelsToReformat[label];
        } else {
            return label;
        }
    }

    _closeCreationForm(){
        this.setState({
            isCreatingEvent: false
        });
    }

    _cleanData(data) {
        let formattedData = [];
        data.forEach((e) => {
            let event = Object.assign({}, e);
            event.type = 'event';
            event.date = this.timeManager.getDateTimeString(event.date);
            if (event.eventType === EVENT_TYPES.Recurring) {
                event.frequency = `every ${event.recurStep} ${event.recurMeasure}`;
            }
            
            formattedData.push(event);
        });
        return formattedData;
    }

    async _createEvent(event){
        event = await this.calendarClient.createEvent(event);
        if (event) {
            this.props.addEvent(event);
        }
        this.setState({
            isCreatingEvent: false
        });
    }

    async _deleteEvent(event){
        await this.calendarClient.deleteEvent(event.id);
        this.props.removeEvent(event.id);
    }

    render() {
        const filterValues = ['id', 'clockId', 'type', 'recurStep', 'recurMeasure'];
        let data = this.props.calendar.events.concat(this.props.calendar.recurringEvents);
        data = this._cleanData(data);

        if (this.props.visible) {
            return(
                <div className="kb-resource-manager">
                    <div className="title-box">
                        <div>
                            <h1>
                                Events
                            </h1>
                        </div>
                        {
                            !this.state.isCreatingEvent &&
                            <div className="button-box">
                                <div onClick={this._openEventCreationForm}>
                                    <div className="kb-text-btn">
                                        <FontAwesomeIcon
                                            className="icon"
                                            icon="plus-square"
                                        />
                                        <span>
                                            Create New Event
                                        </span>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="form-box">
                        {
                            this.state.isCreatingEvent &&
                            <EventCreationForm
                                onCancel={this._closeCreationForm}
                                onSubmit={this._createEvent}
                            />
                        }
                    </div>
                    <div>
                        {
                            data.length > 0 &&
                            <KoboldioAccordionFolder
                                topLevelKey="name"
                                data={data}
                                labelFormatter={this._formatLabel}
                                config={{
                                    filterValues: filterValues,
                                    itemKeys: { },
                                    onDelete: {
                                        'event': this._deleteEvent
                                    }
                                }}
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
    calendar: state.calendar
});

function mapDispatchToProps(dispatch) {
    return {
        addEvent: (event) => dispatch(addEvent(event)),
        removeEvent: (eventId) => dispatch(removeEvent(eventId))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarManager);