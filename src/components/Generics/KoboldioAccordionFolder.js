import React, { Component } from 'react';

function hasJsonStructure(str) {
    if (typeof str !== 'string') return false;
    try {
        const result = JSON.parse(str);
        const type = Object.prototype.toString.call(result);
        return type === '[object Object]' 
            || type === '[object Array]';
    } catch (err) {
        return false;
    }
}

export default class KoboldioAccordionFolder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLevel: 0,
            selectionPath: []
        };

        // internal methods
        this._makeSelection = this._makeSelection.bind(this);
        this._expandFromSelection = this._expandFromSelection.bind(this);
    }

    _makeSelection(selection, index) {
        let selectionPath = this.state.selectionPath.slice();
        selectionPath.splice(index, selectionPath.length - index, selection);
        this.setState({
            selectionPath: selectionPath,
            currentLevel: index + 1
        });
    }

    _expandFromSelection(selected) {

    }

    render() {
        
        // construct base panel
        let panels = [];
        let options = [];
        let index = 0;

        this.props.data.forEach((item) => {
            const idx = index;

            let optionClassName;
            if (this.state.selectionPath.length > 0
                && this.state.selectionPath[0] === idx) {
                    optionClassName = "kb-accordion-panel-option selected";
            } else {
                optionClassName = "kb-accordion-panel-option";
            }
            
            let label = String(idx).padStart(3, 0) + '.';
            options.push(
                <div
                    className={optionClassName}
                    onClick={() => {
                        this._makeSelection(idx, 0);
                    }}
                >
                    {
                        label &&
                        <div className="label">
                            { label }
                        </div>
                    }
                    <div className="value">
                        { item[this.props.topLevelKey] }
                    </div>
                </div>
            );
            index++;
        });

        const basePanel = (
            <div
                kb-accordion-depth={0}
                className="kb-accordion-panel"
            >
                {
                    options
                }
            </div>
        );

        panels.push(basePanel);

        for (var i = 0; i < this.state.selectionPath.length; i++) {
            // get base selection
            let item = this.props.data[this.state.selectionPath[0]];

            // continue along path if necessary
            for(var j = 1; j < i; j++) {
                item = this.props.data[this.state.selectionPath[j]];
            }

            let panelOptions = [];
            Object.keys(item).forEach((key) => {
                let value = item[key];
                // if object, create an option
                if (hasJsonStructure(value)) {
                    panelOptions.push(
                        <div
                            className="kb-accordion-panel-option"
                            onClick={() => {
                                this._makeSelection(item, i + 1);
                            }}
                        >
                            {
                                this.props.onPrint && 
                                <div>
                                    { this.props.onPrint(item) }
                                </div>
                            } 
                            <div className="key">
                                { key }
                            </div>
                        </div>
                    );
                } else if (!key.toLowerCase().includes('id')) {
                    // if value, create a listing (excluding ids)
                    panelOptions.push(
                        <div
                            className="kb-accordion-panel-listing"
                        >
                            <div className="label">
                                { key }.
                            </div>
                            <div className="value">
                                { item[key] }
                            </div>
                        </div>
                    );
                }
            });
            
            panels.push(
                <div
                    kb-accordion-depth={i}
                    className="kb-accordion-panel"
                >
                    {
                        panelOptions
                    }
                </div>
            )
        }
        
        return(
            <div
                className="kb-accordion"
            >
                { panels }
            </div>
        )
    }
}