import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';

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
            main: {
                position: 'absolute',
                borderRadius: '32px',
                backgroundColor: '#121212',
                padding: '32px',
                boxShadow: '8px 8px rgba(0,0,0,0.7)',
                border: '1px solid rgba(255,255,255,0.1)'
            }
        };
        if (this.state.visible) {
            return(
                <Draggable>
                    <Resizable
                        style={modalStyles.main}
                        defaultSize={{
                            width: 480,
                            height: 300
                        }}
                    >
                        <div className="kb-modal-title">
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
                        <div className="kb-modal-body">
                            {
                                this.props.children
                            }
                        </div>
                    </Resizable>
                </Draggable>
            );
        } else {
            return null;
        }
    }
}