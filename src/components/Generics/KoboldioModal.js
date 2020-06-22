import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class KoboldioModal extends Component {
    constructor(props){
        super(props);

        this.state = {
            visible: false
        };
    }

    componentDidUpdate(prevProps) {
        if(prevProps.visible !== this.props.visible) {
            this.setState({
                visible: this.props.visible
            });
        }
    }

    render(){
        let modalStyles = {
            overlay: {
                top: 0,
                left: 0,
                height: '100%',
                position: 'absolute',
                width: '100%',
                backdropFilter: 'blur(0.5rem)',
                backgroundColor: 'rgba(255,255,255,0.05)'
            },
            main: {
                position: 'absolute',
                top: '10%',
                left: '10%',
                borderRadius: '32px',
                backgroundColor: '#121212',
                minWidth: '475px',
                minHeight: '300px',
                padding: '32px',
                width: '33%',
                height: '33%',
                boxShadow: '8px 8px rgba(0,0,0,0.7)',
                border: '1px solid rgba(255,255,255,0.1)'
            }
        };
        if (this.state.visible) {
            return(
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.main} >
                        <div className="koboldio-modal-title">
                            { 
                                this.props.title 
                            }
                            <div className="kb-icon-btn">
                                <FontAwesomeIcon
                                    icon="window-close"
                                    onClick={() => {
                                        this.setState({
                                            visible: false
                                        }, () => {
                                            if (this.props.onRequestClose) {
                                                this.props.onRequestClose();
                                            }
                                        });
                                    }}
                                />
                            </div>
                        </div>
                        <hr />
                        <div className="koboldio-modal-body">
                            {
                                this.props.children
                            }
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}