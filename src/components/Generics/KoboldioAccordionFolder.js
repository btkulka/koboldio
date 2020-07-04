import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function isObject(obj) {
    return typeof obj === 'object' && obj !== null;
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
        this._deselectFromPoint = this._deselectFromPoint.bind(this);
        this._printOption = this._printOption.bind(this);
        this._printGroup = this._printGroup.bind(this);
        this._printListing = this._printListing.bind(this);
    }

    _makeSelection(selection, index) {
        let selectionPath = this.state.selectionPath.slice();
        if (selection === this.state.selectionPath[index]) {
            // deselect
            this._deselectFromPoint(index);
        } else {
            // select
            selectionPath.splice(index, selectionPath.length - index, selection);
        }
        this.setState({
            selectionPath: selectionPath,
            currentLevel: index + 1
        });
    }

    _deselectFromPoint(index) {
        let selectionPath = this.state.selectionPath.slice();

        if (index === 0) {
            this.setState({
                selectionPath: [],
                currentLevel: 0
            });
        } else {
            this.setState({
                selectionPath: selectionPath.splice(index, selectionPath.length - index),
                currentLevel: index - 1
            });
        }

       
    }

    _printOption(key, value, i, pathOverride = null) {
        const selectPath = pathOverride ?? key;
        return(
            <div
                key={`panel-${i}-option-${key}`}
                className={"kb-accordion-panel-option " + 
                    (this.state.selectionPath[i] === selectPath ? 'selected' : '')}
                onClick={() => {
                    this._makeSelection(selectPath, i + 1);
                }}
            >
                <div className="key">
                    { key }
                </div>
            </div>
        );
    }

    _printListing(key, value, i) {
        return(
            <div
                key={`panel-${i}-listing-${key}`}
                className="kb-accordion-panel-listing"
            >
                <div className="label">
                    { 
                        !this.props.labelFormatter &&
                        key + '.'
                    }
                    {
                        this.props.labelFormatter &&
                        this.props.labelFormatter(key)
                    }
                </div>
                <div className="value">
                    { String(value ?? '') }
                </div>
            </div>
        )
    }

    _printGroup(key, value, i) {
        let items = [];
        value.forEach((item, index) => {
            // confusing but: retrieve the key, as defined by the config, which is defined by the item type
            const itemKey = item[this.props.config.itemKeys[item.type]];
            if (isObject(item)) {
                items.push(this._printOption(itemKey, item[itemKey], i + 1, [key, index]));
            } else if (Array.isArray(item)) {
                items.push(this._printGroup(key + '.' + itemKey, item[itemKey], i + 1));
            } else if (!this.props.config.filterValues.includes(itemKey)) {
                items.push(this._printListing(itemKey, item[itemKey], i + 1));
            }
        });
        return(
            <div
                key={`panel-${i}-group-${key}`}
                className="kb-accordion-panel-group"
            >
                <div className="kb-subtitle">
                    { key }
                </div>
                {
                    items
                }
            </div>
        );
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
            
            let label = String(idx + 1).padStart(3, 0) + '.';
            options.push(
                <div
                    key={'panel-0-option-' + label}
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
                key={'panel-base'}
                className="kb-accordion-panel"
            >
                {
                    options
                }
            </div>
        );

        panels.push(basePanel);

        for (let i = 0; i < this.state.selectionPath.length; i++) {
            // get base selection to begin
            let panelItem = this.props.data[this.state.selectionPath[0]];
            // traverse the tree up to the selection point
            for(var j = 1; j <= i; j++) {
                if (Array.isArray(this.state.selectionPath[j])){
                    // eslint-disable-next-line
                    this.state.selectionPath[j].forEach((step) => {
                        panelItem = panelItem[step];
                    });
                } else {
                    panelItem = panelItem[this.state.selectionPath[j]];
                }
            }

            // set sections
            let panelOptions = [];
            let panelGroups = [];
            let panelListings = [];

            // recursively print items
            Object.keys(panelItem).forEach((key) => {
                let value = panelItem[key];
                // if object, create an option
                if (Array.isArray(value)) {
                    panelGroups.push(this._printGroup(key, value, i));
                } else if (isObject(value)) {
                    // if array, print group
                    panelOptions.push(this._printOption(key, value, i));
                } else if (!this.props.config.filterValues.includes(key)) {
                    // if value, create a listing (excluding filtered fields)
                    panelListings.push(this._printListing(key, value, i));
                }
            });
            let entityActions;
            if (this.props.config) {
                const idx = i;
                const actionItem = panelItem;
                entityActions = (
                    <div className="entity-action-tools">
                        {
                            this.props.config.onDelete[actionItem['type']] &&
                            <div 
                                className="kb-text-btn"
                                onClick={() => {
                                    this._deselectFromPoint(idx);
                                    this.props.config.onDelete[actionItem['type']](actionItem);
                                }}
                            >
                                <FontAwesomeIcon
                                    className="icon"
                                    icon="trash-alt"
                                    title={"delete " + actionItem['type']}
                                />
                                <span>
                                    Delete
                                </span>
                            </div>
                        }
                    </div>
                );
            }
            
            panels.push(
                <div
                    key={`panel-${i}`}
                    kb-accordion-depth={i}
                    className="kb-accordion-panel"
                >
                    { 
                        this.props.config &&
                        entityActions 
                    }
                    { panelListings }
                    { panelOptions }
                    { panelGroups }
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