import React, { Component } from 'react';


export default class RegisterForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: undefined,
            email: undefined,
            password: undefined,
            confirmPassword: undefined,
        };

        // internal methods
        this._updateUsername = this._updateUsername.bind(this);
        this._updatePassword = this._updatePassword.bind(this);
        this._updateConfirmPassword = this._updateConfirmPassword.bind(this);
        this._updateEmail = this._updateEmail.bind(this);
        this._register = this._register.bind(this);
    }

    get passwordsDoNotMatch() {
        return(
            this.state.password &&
            this.state.confirmPassword &&
            this.state.password !== this.state.confirmPassword
        );
    }

    get isValid() {
        return (
            this.state.username &&
            this.state.email &&
            this.state.password && 
            this.state.confirmPassword &&
            this.state.password === this.state.confirmPassword
        );
    }

    _updateUsername(val) {
        this.setState({
            username: val
        });
    }

    _updatePassword(val) {
        this.setState({
            password: val
        });
    }

    _updateConfirmPassword(val) {
        this.setState({
            confirmPassword: val
        });
    }

    _updateEmail(val) {
        this.setState({
            email: val
        });
    }

    _register() {
        if (this.isValid) {
            this.props.onSubmit({
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            });
        }
    }

    render(){ 
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 8,
                    flex: 1
                }}
            >
                <h3>Create a new user.</h3>
                <input
                    type="text"
                    className="kb-input required long"
                    onChange={(e) => {
                        this._updateUsername(e.target.value);
                    }}
                    value={this.state.username}
                    placeholder="username"
                />
                <input
                    type="text"
                    className="kb-input required long"
                    onChange={(e) => {
                        this._updateEmail(e.target.value);
                    }}
                    value={this.state.email}
                    placeholder="email"
                />
                <input
                    type="password"
                    className={"kb-input long " + (this.passwordsDoNotMatch ? 'kb-dirty' : 'required') }
                    onChange={(e) => {
                        this._updatePassword(e.target.value);
                    }}
                    value={this.state.password}
                    placeholder="password"
                />
                <input
                    type="password"
                    className={"kb-input long " + (this.passwordsDoNotMatch ? 'kb-dirty' : 'required') }
                    onChange={(e) => {
                        this._updateConfirmPassword(e.target.value);
                    }}
                    value={this.state.confirmPassword}
                    placeholder="confirm password"
                />
                <div
                    className="kb-error-label"
                    style={{
                        visibility: (this.passwordsDoNotMatch ? 'visible' : 'hidden'),
                        margin: 16
                    }}
                >
                    Passwords do not match
                </div>
                <div
                    className={"kb-text-btn " + (!this.isValid ? 'disabled' : '')}
                    onClick={this._register}
                >
                    Register
                </div>
            </div>
        );
    }
}