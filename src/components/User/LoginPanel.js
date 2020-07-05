import React, { Component } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { connect } from 'react-redux';
import { registerUser, logIn } from '../../redux/actions/appActions';
import RingLoader from 'react-spinners/RingLoader';
import COLORS from '../../constants/Colors';

const PANEL_MODES = {
    Register: 'Register',
    LogIn: 'LogIn'
};

class LoginPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mode: PANEL_MODES.LogIn,
            isLoading: false
        };

        // internal methods
        this._changeMode = this._changeMode.bind(this);
        this._registerUser = this._registerUser.bind(this);
        this._login = this._login.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.app !== this.props.app) {
            this.setState({
                isLoading: false
            });
        }
    }

    _changeMode(mode) {
        this.setState({
            mode
        });
    }

    _registerUser(user) {
        this.setState({
            isLoading: true
        }, () => {
            this.props.registerUser(user);
        });
    }

    _login(user) {
        this.setState({
            isLoading: true
        }, () => {
            this.props.logIn(user);
        });
    }

    render() {
        let style = {
            panel: {
                justifyContent: 'center',
                alignItems: 'center',
                width: 800
            }
        };

        if (this.props.visible) {
            if (this.state.isLoading) {
                return(
                    <div
                        className="kb-dashboard-tile"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 64
                        }}
                    >
                        <RingLoader
                            size={75}
                            color={COLORS.CoolBlue}
                            loading={this.state.isLoading}
                        />
                        <h4>logging in...</h4>
                    </div>
                );
            } else {
                if (this.state.mode === PANEL_MODES.LogIn) {
                    return(
                        <div
                            className="kb-dashboard-tile"
                            style={style.panel}
                        >
                            <div
                                className="kb-text-btn"
                                onClick={() => {
                                   this._changeMode(PANEL_MODES.Register);
                                }}
                            >
                                Need an Account? Register
                            </div>
                            <LoginForm
                                onSubmit={this._login}
                            />
                        </div>
                    );
                } else {
                    return (
                        <div
                            className="kb-dashboard-tile"
                            style={style.panel}
                        >
                            <div
                                className="kb-text-btn"
                                onClick={() => {
                                    this._changeMode(PANEL_MODES.LogIn);
                                }}
                            >
                                Return to Login
                            </div>
                            <RegisterForm
                                onSubmit={this._registerUser}
                            />
                        </div>
                    )
                }
            }
        } else {
            return null;
        }
    }
}

const mapStateToProps = (state) => ({
    app: state.app
});

function mapDispatchToProps(dispatch) {
    return {
        registerUser: (user) => dispatch(registerUser(user)),
        logIn: (user) => dispatch(logIn(user))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPanel);