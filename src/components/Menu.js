import React, { Component } from 'react';
import './Menu.css';
import KoboldioModal from './Generics/KoboldioModal';
import { connect } from 'react-redux';
import { loadFiles } from '../redux/actions/menuActions';
import { resetClock, loadClockState } from '../redux/actions/clockActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CalendarManager from './Calendar/CalendarManager';

class Menu extends Component {
    constructor(props){
        super(props);

        this.state = {
            isSelectingLoad: false,
            isManagingCalendar: false,
            loadFiles: []
        };

        this._openLoadFileSelection = this._openLoadFileSelection.bind(this);
        this._save = this._save.bind(this);
        this._clockToSaveFile = this._clockToSaveFile.bind(this);
        this._loadFile = this._loadFile.bind(this);
        this._hideLoad = this._hideLoad.bind(this);
        
    }

    async _openLoadFileSelection(){
        let files;
        await fetch('http://localhost:8080/saves')
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

            fetch(`http://localhost:8080/saves/${file.id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(file)
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            });;
        } else {
            delete file.id;
            await fetch('http://localhost:8080/saves',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(file)
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            });
        }
    }

    _clockToSaveFile(){
        const file = Object.assign({}, this.props.clock);
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
            mode: file.mode
        };

        return save;
    }

    _loadFile(file) {
        this.setState({
            isSelectingLoad: false
        }, () => {
            this.props.loadGameFile({
                id: file.id,
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
        });
    }

    _hideLoad() {
        this.setState({
            isSelectingLoad: false
        });
    }

    async _deleteFile(id) {
        await fetch(`http://localhost:8080/saves/${id}`,
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
                    <div className="menu-set">
                        <div className="menu-option" onClick={this.props.resetClock}>
                            New
                        </div>
                        <div className="menu-option" onClick={this._save}>
                            Save
                        </div>
                        <div className="menu-option" onClick={this._openLoadFileSelection}>
                            Load
                        </div>
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
                    </div>
                    <div className="menu-set">
                        <div className="menu-option" onClick={() => {
                            this.setState({
                                isManagingCalendar: true
                            });
                        }}>
                            Calendar
                            <CalendarManager
                                visible={this.state.isManagingCalendar}
                                onHide={(visible) => {
                                    this.setState({
                                        isManagingCalendar: visible
                                    });
                                }}
                            />
                        </div>
                        <div className="menu-option">
                            Config
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    menu: state.menu,
    clock: state.clock
});

function mapDispatchToProps(dispatch) {
    return {
        loadFiles: (files) => dispatch(loadFiles(files)),
        resetClock: () => dispatch(resetClock()),
        loadGameFile: (file) => dispatch(loadClockState(file))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);