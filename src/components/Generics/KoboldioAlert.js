import React, { Component } from 'react';
import { ALERT_TYPES } from '../../constants/AlertConstants';
import '../../Koboldio.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class KoboldioAlert extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visibilityToggle: props.visibilityToggle
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.visibilityToggle !== this.props.visibilityToggle) {
            this.setState({
                visibilityToggle: this.props.visibilityToggle
            });
        }
    }

    render(){

        let typeStyle;
        if (this.props.type === ALERT_TYPES.Info) {
            typeStyle = {
                backgroundColor: '#d6f0fa',
                color: '#0099cc',
                border: '2px solid #0099cc'
            };
        } else if (this.props.type === ALERT_TYPES.Danger) {
            typeStyle = {
                backgroundColor: '#ffdada',
                color: '#CC0000',
                border: '2px solid #CC0000'
            };
        } else if (this.props.type === ALERT_TYPES.Success) {
            typeStyle = {
              backgroundColor: '#ccf4dc',
              color: "#007E33",
              border: '2px solid #007E33'
            };
        } else if (this.props.type === ALERT_TYPES.Warning) {
            typeStyle = {
                backgroundColor: '#fff1d6',
                color: '#ff8800',
                border: '2px solid #ff8800'
            };
        }

        return(
            <div
                className="kb-alert"
                style={{
                ...typeStyle,
                visibility: this.state.visibilityToggle === true ? 'visible' : 'hidden'
                }}
            >
                <div className="message-box">
                    { this.props.message }
                </div>
                <div className="close-button">
                    <div
                        className="kb-text-btn"
                        onClick={() => {
                            this.props.onRequestClose();
                        }}
                    >
                        <FontAwesomeIcon
                            icon="window-close"
                        />
                    </div>
                </div>
            </div>
        )
    }
}