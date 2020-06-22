import React, { Component } from 'react';
import './ModeSelector.css';

export default class ModeSelector extends Component {
    constructor(props){
        super(props);

        this.state = {
            mode: props.defaultMode ? props.defaultMode : props.modes[0]
        }

        this._makeSelection = this._makeSelection.bind(this);
    }

    _makeSelection(mode) {
        this.setState({
            mode: mode
        }, () => {
            if (this.props.onSelectionMade) {
                this.props.onSelectionMade(this.state.mode);
            }
        });
    }

    render() {

        let options = [];
        this.props.modes.forEach((mode) => {
            let className = "pill";
            if (mode === this.state.mode) {
                className += "-selected";
            }
            options.push(
                <div
                    key={mode}
                    className={className}
                    onClick={() => {
                        this._makeSelection(mode);
                    }}
                >
                    <p>
                        { mode }
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