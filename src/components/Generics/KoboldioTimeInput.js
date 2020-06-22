import React, { Component } from 'react'
import './KoboldioTimeInput.css';

export default class KoboldioTimeInput extends Component {
    constructor(props){
        super(props);

        // internal methods
        this._updateTime = this._updateTime.bind(this);
    }

    _updateTime() {
        this.props.onChange(this.props.value);
    }

    render(){
        return(
            <div className="wrapper">
                <div className="digit-wrapper">
                    <input 
                        className="digit-input"
                        pattern="[0-9]*"
                        maxLength="2"
                        value={this.props.value.y} 
                        onChange={(e) => {
                            let value = e.target.value === '' ? 0 : Number(e.target.value)
                            this.props.value.y = value;
                            this._updateTime();
                        }} 
                    />
                    <label>
                        years
                    </label>
                </div>
                <div className="digit-wrapper">
                    <input 
                        className="digit-input" 
                        pattern="[0-9]*"
                        maxLength="2"
                        value={this.props.value.month} 
                        onChange={(e) => {
                            let value = e.target.value === '' ? 0 : Number(e.target.value)
                            this.props.value.month = value;
                            this._updateTime();
                        }} 
                    />
                    <label>
                        months
                    </label>
                </div>
                <div className="digit-wrapper">
                    <input 
                        className="digit-input" 
                        pattern="[0-9]*"
                        maxLength="2"
                        value={this.props.value.d} 
                        onChange={(e) => {
                            let value = e.target.value === '' ? 0 : Number(e.target.value)
                            this.props.value.d = value;
                            this._updateTime();
                        }} 
                    />
                    <label>
                        days
                    </label>
                </div>
                <div className="digit-wrapper">
                        <input 
                            className="digit-input" 
                            pattern="[0-9]*"
                            maxLength="2"
                            value={this.props.value.h} 
                            onChange={(e) => {
                                let value = e.target.value === '' ? 0 : Number(e.target.value)
                                this.props.value.h = value;
                                this._updateTime();
                            }} 
                        />
                    <label>
                        hours
                    </label>
                </div>
                <div className="digit-wrapper">
                        <input 
                            className="digit-input" 
                            pattern="[0-9]*"
                            maxLength="2"
                            value={this.props.value.m} 
                            onChange={(e) => {
                                let value = e.target.value === '' ? 0 : Number(e.target.value)
                                this.props.value.m = value;
                                this._updateTime();
                            }} 
                        />
                    <label>
                        minutes
                    </label>
                </div>
                <div className="digit-wrapper">
                    <input 
                        className="digit-input" 
                        pattern="[0-9]*"
                        maxLength="2"
                        value={this.props.value.s} 
                        onChange={(e) => {
                            let value = e.target.value === '' ? 0 : Number(e.target.value)
                            this.props.value.s = value;
                            this._updateTime();
                        }} 
                    />
                    <label>
                        seconds
                    </label>
                </div>
                <div className="digit-wrapper">
                    <input 
                        className="digit-input" 
                        pattern="[0-9]*"
                        maxLength="2"
                        value={this.props.value.ms} 
                        onChange={(e) => {
                            let value = e.target.value === '' ? 0 : Number(e.target.value)
                            this.props.value.ms = value;
                            this._updateTime();
                        }} 
                    />
                    <label>
                        milliseconds
                    </label>
                </div>
            </div>
        )
    }
}