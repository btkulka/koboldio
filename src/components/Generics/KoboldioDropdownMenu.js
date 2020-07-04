import React, { Component } from 'react';

export default class KoboldioDropdownMenu extends Component {
    constructor(props){
        super(props);

        if (props.options === undefined) {
            throw new Error("You must provide options with a dropdown menu.");
        }
    }

    render(){
        let options = [];
        this.props.options.forEach((option) => {
            options.push(option);
        });

        if (this.props.isOpen) {
            return(
                <div
                    className="kb-dropdown-menu"
                    onClick={this._closeMenu}
                    style={{
                        left: this.props.coordinates.x,
                        top: this.props.coordinates.y + 8,
                        width: this.props.width - 16
                    }}
                >
                    {
                        options
                    }
                </div>
            );
        } else {
            return null;
        }
    }
}