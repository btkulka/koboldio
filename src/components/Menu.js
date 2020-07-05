import React, { Component } from 'react';
import './Menu.css';
import KoboldioModal from './Generics/KoboldioModal';
import { connect } from 'react-redux';
import { loadFiles } from '../redux/actions/menuActions';
import { showAlert } from '../redux/actions/alertsActions';
import { loadLocations, loadRoads, connectRoad } from '../redux/actions/locationActions';
import { resetClock, loadClockState, setClockId } from '../redux/actions/clockActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ALERT_TYPES } from '../constants/AlertConstants';
import { changeAppMode } from '../redux/actions/appActions';
import { APP_MODES } from '../constants/AppModes';
import { loadCharacters, setPartyState } from '../redux/actions/characterActions';
import KoboldioDropdownMenu from './Generics/KoboldioDropdownMenu';
import CalendarClient from '../clients/CalendarClient';
import { loadEvents, setEvents } from '../redux/actions/calendarActions';

class Menu extends Component {
    constructor(props){
        super(props);

        this.state = {
            isSelectingLoad: false,
            isManagingCalendar: false,
            loadFiles: [],
            resourceDropdown: {
                isOpen: false,
                width: 0,
                coordinates: {
                    x: 0,
                    y: 0
                }
            },
            fileDropdown: {
                isOpen: false,
                width: 0,
                coordinates: {
                    x: 0,
                    y: 0
                }
            }

        };

        // members
        this.calendarClient = new CalendarClient();

        // internal methods
        this._openLoadFileSelection = this._openLoadFileSelection.bind(this);
        this._save = this._save.bind(this);
        this._clockToSaveFile = this._clockToSaveFile.bind(this);
        this._loadFile = this._loadFile.bind(this);
        this._hideLoad = this._hideLoad.bind(this);
        this._toggleResourceDropdownMenu = this._toggleResourceDropdownMenu.bind(this);
        this._toggleFileDropdownMenu = this._toggleFileDropdownMenu.bind(this);
        this._makeDropdownSelection = this._makeDropdownSelection.bind(this);
    }

    async _openLoadFileSelection(){
        let files;
        await fetch('http://localhost:3401/saves')
            .then(response => response.json())
            .then(data => {
                files = data;
            });

        this.props.loadFiles(files);
        this.setState({
            isSelectingLoad: true
        });
    }

    async _save(){
        let file = this._clockToSaveFile();
        if(file.id){

            fetch(`http://localhost:3401/saves/${file.id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(file)
            })
            .then((response) => response.json())
            .then((data) => {
                this.props.showAlert({
                    type: ALERT_TYPES.Success,
                    message: `'${file.campaignName}' saved.`
                });
            });;
        } else {
            delete file.id;
            await fetch('http://localhost:3401/saves',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(file)
            })
            .then((response) => response.json())
            .then((data) => {
                this.props.setClockId(data);
                this.props.showAlert({
                    type: ALERT_TYPES.Success,
                    message: `'${file.campaignName}' saved.`
                });
            });
        }
    }

    _clockToSaveFile(){
        debugger;
        const file = Object.assign({}, this.props.clock);
        const location = Object.assign({}, this.props.location.currentLocation)
        let save = {
            id: file.id,
            campaignName: file.campaignName,
            elapsedTime: file.elapsedTime,
            elapsedWorldTime: file.elapsedWorldTime,
            y: file.worldTime.y,
            month: file.worldTime.month,
            d: file.worldTime.d,
            h: file.worldTime.h,
            m: file.worldTime.m,
            s: file.worldTime.s,
            ms: file.worldTime.ms,
            campaignDay: file.campaignDay,
            mode: file.mode,
            currentLocationId: location.id,
            party: this.props.character.party
        };

        return save;
    }

    async _loadFile(file) {

        // Load locations
        await fetch(`http://localhost:3401/locations?clockId=${file.id}`)
            .then(response => response.json())
            .then((locations) => {
                this.props.loadLocations(locations);
            });

        // Load roads
        await fetch(`http://localhost:3401/roads?clockId=${file.id}`)
            .then(response => response.json())
            .then((roads) => {
                this.props.loadRoads(roads);
                roads.forEach((road) => {
                    this.props.connectRoad(road);
                });
            });
        
        // Load characters
        await fetch(`http://localhost:3401/characters?clockId=${file.id}`)
            .then(response => response.json())
            .then((characters) => {
                if (characters !== {}) {
                    this.props.loadCharacters(characters);
                }
            });
        
        this.calendarClient.getAllEvents(file.id)
            .then((events) => {
                // clear
                this.props.setEvents({
                    events: [],
                    recurringEvents: []
                });
                // load
                this.props.loadEvents(events);
            });

        // Load state
        this.props.loadGameFile({
            id: file.id,
            currentLocationId: file.currentLocationId,
            campaignName: file.campaignName,
            elapsedTime: file.elapsedTime,
            elapsedWorldTime: file.elapsedWorldTime,
            worldTime: {
                y: file.y,
                month: file.month,
                d: file.d,
                h: file.h,
                m: file.m,
                s: file.s,
                ms: file.ms
            },
            campaignDay: file.campaignDay,
            mode: file.mode
        });

        // Load party
        this.props.setPartyState(file.party)

        this.setState({
            isSelectingLoad: false
        });
    }

    _hideLoad() {
        this.setState({
            isSelectingLoad: false
        });
    }

    async _deleteFile(id) {
        await fetch(`http://localhost:3401/saves/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                this._openLoadFileSelection();
            });
    }

    _toggleResourceDropdownMenu(e) {
        const coordinates = {
            x: e.target.offsetLeft,
            y: e.target.offsetTop + e.target.offsetHeight
        };
        this.setState({
            fileDropdown: {
                ...this.state.fileDropdown,
                isOpen: false
            },
            resourceDropdown: {
                coordinates: coordinates,
                width: e.target.offsetWidth,
                isOpen: !this.state.resourceDropdown.isOpen
            }
        });
    }

    _toggleFileDropdownMenu(e) {
        const coordinates = {
            x: e.target.offsetLeft,
            y: e.target.offsetTop + e.target.offsetHeight
        };
        this.setState({
            fileDropdown: {
                coordinates: coordinates,
                width: e.target.offsetWidth,
                isOpen: !this.state.fileDropdown.isOpen
            },
            resourceDropdown: {
                ...this.state.resourceDropdown,
                isOpen: false
            }
        });
    }

    _makeDropdownSelection(callback = null) {
        this.setState({
            fileDropdown: {
                ...this.state.fileDropdown,
                isOpen: false
            },
            resourceDropdown: {
                ...this.state.resourceDropdown,
                isOpen: false
            }
        }, () => {
            if (callback) {
                callback();
            }
        });
    }

    render(){
        let loadFiles = [];
        this.props.menu.files.forEach((file) => {
            const hour = String(file.h).padStart(2, '0');
            const minute = String(file.m).padStart(2, '0');
            const second = String(file.s).padStart(2, '0');

            const timeString = String(hour + ":" + minute + ":" + second);
            loadFiles.push(
                <div
                    key={file.id}
                    className="load-file-record"
                >
                    <div className="info-wrapper"
                        onClick={() => {
                            this._loadFile(file);
                        }}
                    >
                        <div className="title">
                            { file.campaignName }
                        </div>
                        <div className="subtitle">
                            ( Day { file.campaignDay } )| { timeString }
                        </div>
                    </div>
                    <div className="kb-icon-btn">
                        <FontAwesomeIcon
                            icon="trash-alt"
                            onClick={() => {
                                this._deleteFile(file.id);
                            }}
                        />
                    </div>
                </div>
            )
        });

        return(
            <div className="menu-wrapper">
                <div className="menu-bar">
                    <div
                        className="menu-option"
                        onClick={() => {
                            this.props.changeAppMode(APP_MODES.Clock)
                        }}
                    >
                        <FontAwesomeIcon
                            className="icon"
                            icon="clock"
                        />
                    </div>
                    {
                        this.props.app.user &&
                        <div
                            className={"menu-option " + (this.state.isFileDropdownOpen ? 'selected' : '')}
                            onClick={this._toggleFileDropdownMenu}
                        >
                            File
                        </div>
                    }
                    {   this.props.clock.id &&  // game has been saved
                        <div
                            className={"menu-option " + (this.state.isResourceDropdownOpen ? 'selected' : '')}
                            onClick={this._toggleResourceDropdownMenu}
                        >
                            Resources
                        </div>
                    }
                    <KoboldioModal
                        onRequestClose={this._hideLoad}
                        visible={this.state.isSelectingLoad}
                        title="Load File"
                    >
                        {
                            loadFiles.length > 0 &&
                            loadFiles
                        }
                    </KoboldioModal>
                    <KoboldioDropdownMenu
                        isOpen={this.state.resourceDropdown.isOpen}
                        coordinates={this.state.resourceDropdown.coordinates}
                        width={this.state.resourceDropdown.width}
                        options={[
                            <div
                                key={"resource-dropdown-select-calendar"}
                                className="menu-option"
                                onClick={() => {
                                    this._makeDropdownSelection(
                                        () => { this.props.changeAppMode(APP_MODES.CalendarManager); }
                                    );
                                }}
                            >
                                Calendar
                            </div>,
                            <div
                                key={"resource-dropdown-select-characters"}
                                className="menu-option"
                                onClick={() => {
                                    this._makeDropdownSelection(
                                        () => { this.props.changeAppMode(APP_MODES.CharacterManager); }
                                    );
                                }}
                            >
                                Characters
                            </div>,
                            <div
                                key={"resource-dropdown-select-location"}
                                className="menu-option"
                                onClick={() => {
                                    this._makeDropdownSelection(
                                        () => { this.props.changeAppMode(APP_MODES.LocationManager); }
                                    );
                                }}
                            >
                                Locations
                            </div>
                        ]}
                    />
                    <KoboldioDropdownMenu
                        isOpen={this.state.fileDropdown.isOpen}
                        coordinates={this.state.fileDropdown.coordinates}
                        width={this.state.fileDropdown.width}
                        options={[
                            <div
                                key={"file-dropdown-select-new"}
                                className="menu-option"
                                onClick={() => {
                                    this._makeDropdownSelection(
                                        this.props.resetClock
                                    );
                                }}
                            >
                                New
                            </div>,
                             <div
                             key={"file-dropdown-select-save"}
                                className="menu-option"
                                onClick={() => {
                                    this._makeDropdownSelection(
                                        this._save
                                    );
                                }}
                            >
                                Save
                            </div>,
                            <div
                                key={"file-dropdown-select-load"}
                                className="menu-option"
                                onClick={() => {
                                    this._makeDropdownSelection(
                                        this._openLoadFileSelection
                                    );
                                }}>
                                Load
                            </div>
                        ]}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    app: state.app,
    menu: state.menu,
    clock: state.clock,
    location: state.location,
    character: state.character
});

function mapDispatchToProps(dispatch) {
    return {
        loadFiles: (files) => dispatch(loadFiles(files)),
        resetClock: () => dispatch(resetClock()),
        loadGameFile: (file) => dispatch(loadClockState(file)),
        showAlert: (alert) => dispatch(showAlert(alert)),
        loadLocations: (locations) => dispatch(loadLocations(locations)),
        loadRoads: (roads) => dispatch(loadRoads(roads)),
        changeAppMode: (mode) => dispatch(changeAppMode(mode)),
        connectRoad: (road) => dispatch(connectRoad(road)),
        loadCharacters: (characters) => dispatch(loadCharacters(characters)),
        setPartyState: (party) => dispatch(setPartyState(party)),
        setClockId: (clockId) => dispatch(setClockId(clockId)),
        loadEvents: (events) => dispatch(loadEvents(events)),
        setEvents: (events) => dispatch(setEvents(events))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);