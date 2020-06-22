import React, { Component } from 'react';
import './Header.css';

export default class Header extends Component {
    constructor(props){
        super(props);

        this.state = {
            isAlertVisible: false
        };
    }

    render() {
        return (
            <div className="page-header">
                <div className="content">
                    <div className="title">
                        kobold.io
                    </div>
                    <div className="subtitle">
                        theTexasWave
                    </div>
                </div>
            </div>
        )
    }
}