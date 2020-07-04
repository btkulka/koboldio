import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EVENT_TYPES, RECUR_MEASURES, DATE_TYPES } from '../../constants/EventConstants';
import { MONTHS } from '../../constants/CalendarNames';
import { connect } from 'react-redux';
import ClockTime from '../../models/clock-time';
import TimeManager from '../../classes/TimeManager';

class EventCreationForm extends Component {
    constructor(props){
        super(props);

        this.state = {
            eventType: undefined,
            name: undefined,
            description: undefined,
            date: Object.assign({}, this.props.clock.worldTime),
            locationId: undefined,
            campaignDay: undefined,
            isCampaignDayDirty: false,
            isLengthDirty: false,
            isDateDirty: false,
            isYearDirty: false,
            isHourDirty: false,
            isMinuteDirty: false,
            recurStep: undefined,
            recurMeasure: undefined,
            dateType: undefined,
            length: undefined,
            isAllDay: true
        };

        // members
        this.timeManager = new TimeManager();

        // internal methods
        this._updateEventType = this._updateEventType.bind(this);
        this._updateName = this._updateName.bind(this);
        this._updateDescription = this._updateDescription.bind(this);
        this._updateDate = this._updateDate.bind(this);
        this._updateCampaignDay = this._updateCampaignDay.bind(this);
        this._updateRecurStep = this._updateRecurStep.bind(this);
        this._updateRecurMeasure = this._updateRecurMeasure.bind(this);
        this._updateDateType = this._updateDateType.bind(this);
        this._updateLocationId = this._updateLocationId.bind(this);
        this._updateLength = this._updateLength.bind(this);
        this._updateAllDay = this._updateAllDay.bind(this);
        this._submit = this._submit.bind(this);
        this._cancel = this._cancel.bind(this);
    }

    // Getters ===================================

    get dateTypeSelect() {
        let dateTypeOptions = [
            <option
                key={`date-type-select-empty`}
                className="kb-select-item"
                value={undefined}
            >
            </option>
        ];

        Object.keys(DATE_TYPES).forEach((dateType) => {
            dateTypeOptions.push(
                <option
                    key={`date-type-select-${dateType}`}
                    className="kb-select-item"
                    value={DATE_TYPES[dateType]}
                >
                    { DATE_TYPES[dateType] }
                </option>
            )
        });

        return (
            <select
                className="kb-select required"
                value={this.state.dateType}
                onChange={(e) => {
                    this._updateDateType(e.target.value);
                }}
            >
                {
                    dateTypeOptions
                }
            </select>
        );
    }

    get locationSelect() {
        let locations = this.props.location.locations ?? [];
        let locationOptions = [
            <option
                key={`location-select-empty`}
                className="kb-select-item"
                value={undefined}
            >
            </option>
        ];

        locations.forEach((location) => {
            locationOptions.push(
                <option
                    key={`location-select-${location.id}`}
                    className="kb-select-item"
                    value={location.id}
                >
                    { location.name }
                </option>
            )
        });

        return (
            <select
                className="kb-select"
                value={this.state.locationId}
                onChange={(e) => {
                    this._updateLocationId(e.target.value);
                }}
            >
                {
                    locationOptions
                }
            </select>
        );
    }

    get isValid() {
        let recurCheck = true;

        if (this.state.eventType === EVENT_TYPES.Recurring) {
            recurCheck = this.state.recurMeasure && this.state.recurStep;
        }

        return (
            this.state.eventType &&
            this.state.description &&
            this.state.dateType &&
            this.state.name &&
            ((this.state.campaignDay && !this.state.isCampaignDayDirty) || this.state.date) &&
            !this.state.isLengthDirty &&
            !this.state.isYearDirty &&
            !this.state.isDateDirty &&
            !this.state.isHourDirty &&
            !this.state.isMinuteDirty &&
            (this.state.isAllDay || this.state.length) &&
            recurCheck
        );
    }

    get dateSelector() {
        let styles = {
            dateSelector: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                textAlign: 'center',
                width: '100%'
            },
            formGroup: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            },
            digitInput: {
                textAlign: 'center',
                width: 75
            }
        };

        let monthOptions = [];

        for (let i = 0; i < MONTHS.length; i++) {
            monthOptions.push(
                <option
                    key={`month-select-${MONTHS[i]}`}
                    className="kb-select-item"
                    value={i}
                >
                    { MONTHS[i] }
                </option>
            )
        }

        return(
            <div
                style={styles.dateSelector}
            >
                <div
                    style={{
                        ...styles.formGroup,
                        flex: 0.2
                    }}
                >
                    <input
                        type="text"
                        className={"kb-input " + (this.state.isDateDirty ? 'kb-dirty' : 'required')}
                        value={this.state.date.d}
                        onChange={(e) => {
                            this._updateDate({
                                d: e.target.value
                            });
                        }}
                        style={styles.digitInput}
                    />
                    <p>
                        day
                    </p>
                </div>
                <div
                    style={{
                        ...styles.formGroup,
                        flex: 0.6,
                        textAlignLast: 'center'
                    }}
                >
                    <select
                        className="kb-select required"
                        value={this.state.date.month}
                        onChange={(e) => {
                            this._updateDate({
                                month: e.target.value
                            });
                        }}
                        style={{
                            width: '100%'
                        }}
                    >
                        {
                            monthOptions
                        }
                    </select>
                    <p>
                        month
                    </p>
                </div>
                <div
                    style={{
                        ...styles.formGroup,
                        flex: 0.2
                    }}
                >
                    <input
                        type="text"
                        className={"kb-input " + (this.state.isYearDirty ? 'kb-dirty' : 'required')}
                        value={this.state.date.y}
                        onChange={(e) => {
                            this._updateDate({
                                y: e.target.value
                            });
                        }}
                        style={styles.digitInput}
                    />
                    <p>
                        year
                    </p>
                </div>
            </div>
        )
    }

    get timeSelector() {
        let styles = {
            timeSelector: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                textAlign: 'center',
                width: '100%'
            },
            formGroup: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 0.5
            },
            digitInput: {
                textAlign: 'center',
                width: 75
            }
        };

        return(
            <div
                style={styles.timeSelector}
            >
                <div style={styles.formGroup}>
                    <input
                        type="text"
                        className={"kb-input " + (this.state.isHourDirty ? 'kb-dirty' : 'required')}
                        value={this.state.date.h}
                        placeholder="00-23"
                        onChange={(e) => {
                            this._updateDate({
                                h: e.target.value
                            });
                        }}
                        style={styles.digitInput}
                    />
                    <p>
                        hour
                    </p>
                </div>
                <div style={styles.formGroup}>
                    <input
                        type="text"
                        className={"kb-input " + (this.state.isMinuteDirty ? 'kb-dirty' : 'required')}
                        value={this.state.date.m}
                        placeholder="00-59"
                        onChange={(e) => {
                            this._updateDate({
                                m: e.target.value
                            });
                        }}
                        style={styles.digitInput}
                    />
                    <p>
                        minute
                    </p>
                </div>
            </div>
        )
    }

    get recurStepInput() {
        let styles = {
            recurStepInput: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                textAlign: 'center',
                width: '100%'
            },
            formGroup: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 0.5
            },
            digitInput: {
                textAlign: 'center',
                width: 75
            }
        };

        let recurOptions = [];
        Object.keys(RECUR_MEASURES).forEach((measure) => {
            recurOptions.push(
                <option
                    key={`measure-select-${measure}`}
                    value={measure}
                    className="kb-select-item"
                >
                    { measure }
                </option>
            );
        })

        return(
            <div
                style={styles.recurStepInput}
            >
                <div style={styles.formGroup}>
                    <input
                        type="text"
                        className={"kb-input " + (this.state.isHourDirty ? 'kb-dirty' : 'required')}
                        value={this.state.recurStep}
                        placeholder="#"
                        onChange={(e) => {
                            this._updateRecurStep(e.target.value);
                        }}
                        style={styles.digitInput}
                    />
                </div>
                <div style={styles.formGroup}>
                    <select
                        className="kb-select"
                        value={this.state.recurMeasure}
                        onChange={(e) => {
                            this._updateRecurMeasure(e.target.value);
                        }}
                    >
                        {
                            recurOptions
                        }
                    </select>
                </div>
            </div>
        );
    }

    // Form reactions =====================

    _updateEventType(val) {
        this.setState({
            eventType: val
        });
    }

    _updateName(val) {
        this.setState({
            name: val
        });
    }

    _updateDescription(val) {
        this.setState({
            description: val
        });
    }

    _updateDate(val) {
        let newDate = {
            ...this.state.date,
            ...val
        };

        this.setState({
            date: newDate,
            isDateDirty: isNaN(newDate.d),
            isYearDirty: isNaN(newDate.y),
            isMinuteDirty: isNaN(newDate.m),
            isHourDirty: isNaN(newDate.h)
        });
    }

    _updateCampaignDay(val) {
        this.setState({
            campaignDay: val,
            isCampaignDayDirty: isNaN(val)
        });
    }

    _updateRecurStep(val) {
        this.setState({
            recurStep: val
        });
    }

    _updateRecurMeasure(val) {
        this.setState({
            recurMeasure: val
        });
    }

    _updateDateType(val) {
        this.setState({
            dateType: val
        });
    }

    _updateLocationId(val) {
        this.setState({
            locationId: Number(val)
        });
    }

    _updateLength(val) {
        this.setState({
            length: val,
            isLengthDirty: isNaN(val)
        });
    }

    _updateAllDay(val) {
        this.setState({
            isAllDay: val
        });
    }

    // Form Controls =========================

    _submit(){
        let event = {
            clockId: this.props.clock.id,
            name: this.state.name,
            eventType: this.state.eventType,
            locationId: this.state.locationId ? Number(this.state.locationId) : undefined,
            description: this.state.description,
            dateType: this.state.dateType,
            isAllDay: this.state.isAllDay,
            date: new ClockTime()
        };

        // set time
        if (event.isAllDay) {
            event.length = 24;
            event.date = {
                ...event.date,
                h: 0,
                m: 0
            };
        } else {
            event.length = Number(this.state.length);
            event.date = {
                ...event.date,
                h: Number(this.state.date.h),
                m: Number(this.state.date.m)
            };
        }

        // set campaign days / calendar days
        if (event.dateType === DATE_TYPES.CampaignDay) {
            event.campaignDay = Number(this.state.campaignDay);
            event.date = this.timeManager.getDateFromCampaignDay(event.campaignDay, {
                h: Number(this.state.date.h),
                m: Number(this.state.date.m)
            });
        } else if (event.dateType === DATE_TYPES.Calendar) {
            event.date = {
                ...event.date,
                d: Number(this.state.date.d),
                month: Number(this.state.date.month),
                year: Number(this.state.date.y)
            };
            event.campaignDay = this.timeManager.getCampaignDayFromDate(event.date);
        }

        // set recurring factors
        if (event.eventType === EVENT_TYPES.Recurring) {
            event.recurStep = Number(this.state.recurStep);
            event.recurMeasure = this.state.recurMeasure;
        }

        if(this.props.onSubmit) {
            this.props.onSubmit(event);
        } else {
            throw(new Error("No onSubmit() supplied for Event Creation Form."));
        }
    }

    _cancel() {
        if (this.props.onCancel) {
            this.props.onCancel();
        } else {
            throw( new Error("No onCancel() supplied for Event Creation Form."));
        }
    }

    // Render ========================

    render() {
        let styles = {
            isDateTypeSelected: { 
                visibility: (this.state.dateType ? 'visible' : 'hidden')
            },
            isNotAllDay: {
                visibility: (!this.state.isAllDay ? 'visible' : 'hidden')
            },
            isRecurring: {
                visibility:  (this.state.eventType === EVENT_TYPES.Recurring ? 'visible' : 'hidden')
            }
        };

        // event type options
        let eventTypeOptions = [
            <option
                key={`event-type-select-empty`}
                className="kb-select-item"
                value={undefined}
            >
            </option>
        ];
        Object.keys(EVENT_TYPES).forEach((eventType) => {
            eventTypeOptions.push(
                <option
                    key={`event-type-select-${eventType}`}
                    className="kb-select-item"
                    value={eventType}
                >
                    { EVENT_TYPES[eventType] }
                </option>
            )
        });

        return(
            <div
                style={{
                    flex: 1
                }}
            >
                <h3>Create an Event</h3>
                <table className="kb-form">
                    <tbody>
                        <tr>
                            <th>
                                name*
                            </th>
                            <td colSpan={2}>
                                <input
                                    type="text"
                                    className="kb-input required"
                                    value={this.state.name}
                                    placeholder="Event name..."
                                    onChange={(e) => {
                                        this._updateName(e.target.value);
                                    }}
                                    style={{
                                        width: '90%'
                                    }}
                                />
                            </td>
                            <th>
                                occurrence*
                            </th>
                            <td>
                                <select
                                    className="kb-select required"
                                    value={this.state.eventType}
                                    placeholder="Recurring or single?"
                                    onChange={(e) => {
                                        this._updateEventType(e.target.value);
                                    }}
                                >
                                    {
                                        eventTypeOptions
                                    }
                                </select>
                            </td>
                            <th>
                                location
                            </th>
                            <td>
                                {
                                    this.locationSelect
                                }
                            </td>
                        </tr>
                        <tr>
                            <th>
                                description*
                            </th>
                            <td colSpan={4}>
                                <textarea
                                    rows="3"
                                    cols="75"
                                    className="kb-input required"
                                    value={this.state.description}
                                    onChange={(e) => {
                                        this._updateDescription(e.target.value);
                                    }}   
                                />
                            </td>
                            <th>
                                date type*
                            </th>
                            <td>
                                {
                                    this.dateTypeSelect
                                }
                            </td>
                        </tr>
                            {
                                this.state.dateType === DATE_TYPES.CampaignDay &&
                                <tr>
                                    <th>
                                        { (this.state.eventType === EVENT_TYPES.Recurring ? 'begins on' : '' ) + 'campaign day*' }
                                    </th>
                                    <td colSpan={4}>
                                        <input
                                            type="text"
                                            className={"kb-input " + (this.state.isCampaignDayDirty ? 'kb-dirty' : 'required')}
                                            value={this.state.campaignDay}
                                            placeholder="Day of campaign..."
                                            onChange={(e) => {
                                                this._updateCampaignDay(e.target.value);
                                            }}
                                        />
                                    </td>
                                    <th style={styles.isRecurring}>
                                        recurs every
                                    </th>
                                    <td style={styles.isRecurring}>
                                        {
                                            this.recurStepInput
                                        }
                                    </td>
                                </tr>
                            }
                            {
                                this.state.dateType === DATE_TYPES.Calendar &&
                                <tr>
                                    <th>
                                        {this.state.eventType === EVENT_TYPES.Recurring ? 'begins on*' : 'date*'}
                                    </th>
                                    <td colSpan={4}>
                                        {
                                            this.dateSelector
                                        }
                                    </td>
                                    <th style={styles.isRecurring}>
                                        recurs every
                                    </th>
                                    <td style={styles.isRecurring}>
                                        {
                                            this.recurStepInput
                                        }
                                    </td>
                                </tr>
                            }
                            <tr>
                                <th>
                                    all day?
                                </th>
                                <td style={{alignItems: 'center'}}>
                                    <input
                                        type="checkbox"
                                        checked={this.state.isAllDay}
                                        onChange={(e) => {
                                            this._updateAllDay(e.target.checked)
                                        }}
                                    />
                                </td>
                                <th style={styles.isNotAllDay}>
                                    time
                                </th>
                                <th style={styles.isNotAllDay} colSpan={2}>
                                    {
                                        this.timeSelector
                                    }
                                </th>
                                <th style={styles.isNotAllDay}>
                                    length*
                                </th>
                                <td style={styles.isNotAllDay}>
                                    <input
                                        type="text"
                                        className={"kb-input " + (this.state.isLengthDirty ? 'kb-dirty' : 'required')}
                                        value={this.state.length}
                                        placeholder="in hrs"
                                        onChange={(e) => {
                                            this._updateLength(e.target.value);
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div
                                        className={"kb-text-btn " + (!this.isValid ? 'disabled' : '')}
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
                                </td>
                                <td>
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
                                </td>
                            </tr>
                        </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    location: state.location,
    clock: state.clock
});

function mapDispatchToProps(dispatch){
    return {

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventCreationForm);