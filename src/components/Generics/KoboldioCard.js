import React, { Component } from 'react';

export default class KoboldioCard extends Component {
    constructor(props){
        super(props);

        this.state = { };
    }

    render() {
        return (
            <div
                className="kb-card"
            >
                <div className="card-tools">
                </div>
                <div className="card-header">
                    {
                        this.props.header
                    }
                </div>
                <div className="card-body">
                    { 
                        this.props.body
                    }
                </div>
                <div className="card-footer">
                    {
                        this.props.footer
                    }
                </div>
            </div>
        );
    }
}