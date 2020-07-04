import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RACES, SEXES, CLASSES } from '../../constants/CharacterConstants';

export default class CharacterCreationForm extends Component {
    constructor(props){
        super(props);

        this.state = {
            name: undefined,
            age: undefined,
            isAgeDirty: false,
            race: undefined,
            sex: undefined,
            class: undefined,
            inParty: false
        };

        // internal methods
        this._updateName = this._updateName.bind(this);
        this._updateRace = this._updateRace.bind(this);
        this._updateSex = this._updateSex.bind(this);
        this._updateAge = this._updateAge.bind(this);
        this._updateInParty = this._updateInParty.bind(this);
        this._updateClass = this._updateClass.bind(this);
        this._submit = this._submit.bind(this);
        this._cancel = this._cancel.bind(this);
    }

    get isValid(){
        return (
            this.state.name !== undefined &&
            this.state.age !== undefined &
            this.state.race !== undefined &&
            this.state.sex !== undefined &&
            this.state.inParty !== undefined &&
            !this.state.isAgeDirty
        );
    }

    _updateName(val) {
        this.setState({
            name: val
        });
    }

    _updateRace(val) {
        this.setState({
            race: val
        });
    }

    _updateSex(val) {
        this.setState({
            sex: val
        });
    }

    _updateAge(val) {
        this.setState({
            age: val,
            isAgeDirty: isNaN(val)
        });
    }

    _updateInParty(val) {
        this.setState({
            inParty: val
        });
    }

    _updateClass(val) {
        this.setState({
            class: val
        });
    }

    _submit(){
        let character = {
            name: this.state.name,
            race: this.state.race,
            sex: this.state.sex,
            age: Number(this.state.age),
            class: this.state.class,
            inParty: this.state.inParty
        };

        if(this.props.onSubmit) {
            this.props.onSubmit(character);
        } else {
            throw(new Error("No onSubmit() supplied for Character Creation Form."));
        }
    }

    _cancel() {
        if (this.props.onCancel) {
            this.props.onCancel();
        } else {
            throw(new Error("No onCancel() supplied for Character Creation Form."));
        }
    }

    render() {
        let raceOptions = [
            <option
                key="race-select-item-empty"
                className="kb-select-item"
                value={undefined}
            >
            </option>
        ];
        Object.keys(RACES).forEach((race) => {
            raceOptions.push(
                <option
                    key={`race-select-item-${race}`}
                    className="kb-select-item"
                    value={race}
                >
                    { RACES[race].name}
                </option>
            );
        });
        let sexOptions = [
            <option
                key="sex-select-item-empty"
                className="kb-select-item"
                value={undefined}
            >
            </option>
        ];
        Object.keys(SEXES).forEach((sex) => {
            sexOptions.push(
                <option
                    key={`race-select-item-${sex}`}
                    className="kb-select-item"
                    value={sex}
                >
                    { sex }
                </option>
            );
        });
        let classOptions = [
            <option
                key="class-select-item-empty"
                className="kb-select-item"
                value={undefined}
            >
            </option>
        ];
        Object.keys(CLASSES).forEach((c) => {
            classOptions.push(
                <option
                    key={`class-select-item-${c}`}
                    className="kb-select-item"
                    value={c}
                >
                    { c }
                </option>
            );
        });

        return(
            <div className="kb-flex-fill">
                <h3>Create a character</h3>
                <div className="kb-table">
                    <div className="kb-row">
                        <div className="kb-col-3">
                            Name
                        </div>
                        <div className="kb-col-2">
                            Race
                        </div>
                        <div className="kb-col-2">
                            Age
                        </div>
                        <div className="kb-col-3">
                            Class
                        </div>
                        <div className="kb-col-1">
                            Sex
                        </div>
                        <div className="kb-col-1">
                            In party?
                        </div>
                    </div>
                    <div className="kb-row">
                        <div className="kb-col-3 center">
                            <input 
                                type="text"
                                className="kb-input"
                                placeholder="character name..."
                                value={this.state.name}
                                onChange={(e) => {
                                    this._updateName(e.target.value);
                                }}
                            ></input>
                        </div>
                        <div className="kb-col-3 center">
                            <select
                                defaultValue={this.state.race}
                                className="kb-select"
                                onChange={(e) => {
                                    this._updateRace(e.target.value);
                                }}
                                >
                                { raceOptions }
                            </select>
                        </div>
                        <div className="kb-col-2 center">
                            <input 
                                type="text"
                                className={"kb-input " + (this.state.isAgeDirty ? 'kb-dirty' : '')}
                                placeholder="age in years..."
                                value={this.state.age}
                                onChange={(e) => {
                                    this._updateAge(e.target.value);
                                }}
                            />
                        </div>
                        <div className="kb-col-3 center">
                            <select
                                defaultValue={this.state.class}
                                className="kb-select"
                                onChange={(e) => {
                                    this._updateClass(e.target.value);
                                }}
                                >
                                { classOptions }
                            </select>
                        </div>
                        <div className="kb-col-1 center">
                            <select
                                defaultValue={this.state.sex}
                                className="kb-select"
                                onChange={(e) => {
                                    this._updateSex(e.target.value);
                                }}
                                >
                                { sexOptions }
                            </select>
                        </div>
                        <div className="kb-col-1 center">
                            <input
                                type="checkbox"
                                value={this.state.inParty}
                                onChange={(e) => {
                                    this._updateInParty(e.target.checked);
                                }}
                            />
                        </div>
                    </div>
                    <div className="kb-row">
                        <div className="kb-col kb-tray">
                            <div className={"kb-text-btn " + (!this.isValid ? 'disabled' : '')}
                                onClick={() => {
                                    if (this.state.isValid) {
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
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}