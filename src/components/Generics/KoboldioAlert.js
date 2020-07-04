import React, { Component } from 'react';
import { ALERT_TYPES } from '../../constants/AlertConstants';
import '../../Koboldio.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fadeIn, fadeOut } from 'react-animations';
import styled, { keyframes } from 'styled-components';
import COLORS from '../../constants/Colors';

const fadeInAnimation = keyframes`${fadeIn}`;
const FadeIn = styled.div`animation: 1s ${fadeInAnimation};`;
const fadeOutAnimation = keyframes`${fadeOut}`;
const FadeOut = styled.div`animation: 1s ${fadeOutAnimation};`;

const fadeOutDelay = 2500;

const ALERT_TRANSITIONS = {
    FadeIn: 1,
    FadeOut: 2
};

export default class KoboldioAlert extends Component {
    constructor(props) {
        super(props);

        this.state = {
            transition: ALERT_TRANSITIONS.FadeIn,
            visibilityToggle: props.visibilityToggle,
            fadeOutDelay: props.fadeOutDelay ?? fadeOutDelay
        };

        // internal methods
        this._fadeOut = this._fadeOut.bind(this);
    }

    componentDidMount() {
        // fade out naturally
        setTimeout(this._fadeOut, this.state.fadeOutDelay);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.visibilityToggle !== this.props.visibilityToggle) {
            setTimeout(this._fadeOut, this.state.fadeOutDelay);
            this.setState({
                transition: ALERT_TRANSITIONS.FadeIn,
                visibilityToggle: this.props.visibilityToggle
            });
        }
    }

    _fadeOut() {
        this.setState({
            transition: ALERT_TRANSITIONS.FadeOut
        }, () => {
            // allow animation to run then
            setTimeout(this.props.onRequestClose, 900);
        });
    }

    render(){

        let typeStyle;
        if (this.props.type === ALERT_TYPES.Info) {
            typeStyle = {
                color: '#0099cc',
                border: '2px ridge #0099cc'
            };
        } else if (this.props.type === ALERT_TYPES.Danger) {
            typeStyle = {
                color: '#CC0000',
                border: '2px solid #CC0000'
            };
        } else if (this.props.type === ALERT_TYPES.Success) {
            typeStyle = {
              color: `${COLORS.SuccessDim}`,
              border: `2px ridge ${COLORS.Success}`
            };
        } else if (this.props.type === ALERT_TYPES.Warning) {
            typeStyle = {
                color: '#ff8800',
                border: '2px solid #ff8800'
            };
        }

        const content = (
            <div
                className="kb-alert"
                style={{
                ...typeStyle,
                visibility: this.state.visibilityToggle === true ? 'visible' : 'hidden'
                }}
            >
                <div
                    className="message-box"
                    dangerouslySetInnerHTML={{ __html: this.props.message }}
                />
                <div 
                    className="close-button"
                    onClick={this._fadeOut}
                >
                    <div
                        className="kb-icon-btn"
                    >
                        <FontAwesomeIcon
                            icon="window-close"
                        />
                    </div>
                </div>
            </div>
        );

        let alert;
        if (this.state.transition === ALERT_TRANSITIONS.FadeIn) {
            alert = (
                <FadeIn>
                    { content }
                </FadeIn>
            );
        } else if (this.state.transition === ALERT_TRANSITIONS.FadeOut) {
            alert = (
                <FadeOut>
                    { content }
                </FadeOut>
            );
        }

        return alert;
    }
}