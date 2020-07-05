import React, {Component} from 'react';
import { connect } from 'react-redux';
import { APP_MODES } from '../../constants/AppModes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { changeAppMode, logOut } from '../../redux/actions/appActions';
import './AccountBox.css';

class AccountBox extends Component {
    constructor(props) {
        super(props);

        // internal methods
        this._changeMode = this._changeMode.bind(this);
        this._logOut = this._logOut.bind(this);
    }
    
    _changeMode(mode) {
        this.props.changeAppMode(mode);
    }

    _logOut(){
        this.props.logOut();
    }

    render() {
        if (this.props.app.user) {
            return(
                <div className="account-box">
                    <div className="user-box">
                        {
                            this.props.app.user.username
                        }
                    </div>
                    <div
                        className="kb-text-btn"
                        onClick={this._logOut}
                    >
                        <FontAwesomeIcon
                                icon="sign-out-alt"
                                style={{
                                    marginRight: 8
                                }}
                            />
                        Log out
                    </div>
                </div>
            );
        } else {
            return (
                <div className="account-box">
                    {
                        this.props.app.mode === APP_MODES.Login &&
                        <div
                            className="kb-text-btn"
                            onClick={() => {
                                this._changeMode(APP_MODES.Clock)
                            }}
                        >
                            Back
                        </div>
                    }
                    {
                        this.props.app.mode !== APP_MODES.Login &&
                        <div
                            className="kb-text-btn"
                            onClick={() => {
                                this._changeMode(APP_MODES.Login)
                            }}
                        >
                            <FontAwesomeIcon
                                icon="sign-in-alt"
                                style={{
                                    marginRight: 8
                                }}
                            />
                            Log in
                        </div>
                    }
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => ({
    app: state.app
});

function mapDispatchToProps(dispatch) {
    return {
        changeAppMode: (mode) => dispatch(changeAppMode(mode)),
        logOut: () => dispatch(logOut())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountBox);