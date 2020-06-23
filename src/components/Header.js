import React, { Component } from 'react';
import './Header.css';
import { connect } from 'react-redux';
import KoboldioAlert from './Generics/KoboldioAlert';

class Header extends Component {
    constructor(props){
        super(props);

        this.state = {
            alertToggle: false
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.alerts.message !== prevProps.alerts.message) {
            this.setState({
                alertToggle: true
            });
        }
    }

    render() {
        return (
            <div className="page-header">
                <div className="content">
                    <div className="logo-box">
                        <div className="title">
                            kobold.io
                        </div>
                        <div className="subtitle">
                            theTexasWave
                        </div>
                    </div>
                    <div class="alert-box">
                        <KoboldioAlert
                            visibilityToggle={this.state.alertToggle}
                            type={this.props.alerts.type}
                            message={this.props.alerts.message}
                            onRequestClose={() => {
                                this.setState({
                                    alertToggle: false
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    alerts: state.alerts
});

function mapDispatchToProps(dispatch){
    return {

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);