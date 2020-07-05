import React, { Component } from 'react';


export default class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: undefined,
            password: undefined
        };

        // members
        this.usernameInput = React.createRef();
        this.passwordInput = React.createRef();

        // internal methods
        this._updateUsername = this._updateUsername.bind(this);
        this._updatePassword = this._updatePassword.bind(this);
        this._logIn = this._logIn.bind(this);
        this._handleKeys = this._handleKeys.bind(this);
    }

    componentDidMount(){
        document.addEventListener("keydown", this._handleKeys);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this._handleKeys);
    }

    get isValid() {
        return (
            this.state.username &&
            this.state.password
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

    _logIn() {
        if (this.isValid) {
            this.props.onSubmit({
                username: this.state.username,
                password: this.state.password
            });
        }
    }

    _handleKeys(e) {
        const confirmKeys = [13]; // return
        if (confirmKeys.includes(e.keyCode)) {  
            if (document.activeElement === this.usernameInput.current) {
                this.passwordInput.current.focus();
            } else if (document.activeElement === this.passwordInput.current) {
                this._logIn();
            }
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
                <h3> Log in.</h3>
                <input
                    ref={this.usernameInput}
                    type="text"
                    className="kb-input required long"
                    onChange={(e) => {
                        this._updateUsername(e.target.value);
                    }}
                    placeholder="username"
                />
                <input
                    ref={this.passwordInput}
                    type="password"
                    className="kb-input required long"
                    onChange={(e) => {
                        this._updatePassword(e.target.value);
                    }}
                    placeholder="password"
                />
                <div
                    className={"kb-text-btn " + (!this.isValid ? 'disabled' : '')}
                    onClick={this._logIn}
                >
                    Log In
                </div>
            </div>
        );
    }
}