import React, { Component } from 'react';
import './Header.css';
import { connect } from 'react-redux';
import { changeTitle } from '../redux/actions/clockActions';
import AccountBox from './User/AccountBox';

class Header extends Component {
    constructor(props){
        super(props);

        this.state = {
            alertToggle: false,
            isEditingTitle: false,
            editTitle: undefined
        };
        
        //internal methods
        this._editTitle = this._editTitle.bind(this);
        this._handleClick = this._handleClick.bind(this);
        this._handleKeys = this._handleKeys.bind(this);

        // references
        this.titleInput = React.createRef();
    }

    // Lifecycle methods
    // =========================

    componentDidMount(){
        document.addEventListener("keydown", this._handleKeys);
        document.addEventListener("mousedown", this._handleClick);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this._handleKeys);
        document.removeEventListener("mousedown", this._handleClick);
    }

    // Internal methods
    // ========================

    _editTitle(val) {
        this.setState({
            editTitle: val
        });
    }

    _handleKeys(e) {
        const confirmKeys = [13]; // return
        if (this.state.isEditingTitle) {
            if (confirmKeys.includes(e.keyCode)) {  
                // submit title change
                this.setState({
                    isEditingTitle: false
                }, () => {
                    this.props.changeTitle(this.state.editTitle);
                });
            }
        }
    }

    _handleClick(e) {
        if (this.state.isEditingTitle) {
            if (this.titleInput && !this.titleInput.current.contains(e.target)) {
                this.titleInput.current.blur();
                // cancel title change
                this.setState({
                    isEditingTitle: false
                });
            }
        }
    }

    // render
    // ================

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
                    <div className="title-box">
                        <div className="kb-tile-header">
                            <div className="label">
                                campaign name
                            </div>
                            <div className="header">
                                {
                                    !this.state.isEditingTitle &&
                                    <div className="clock-title" onClick={() => {
                                        this.setState({
                                            isEditingTitle: true
                                        }, () => {
                                            this.titleInput.current.select();
                                        });
                                    }}>
                                        { this.props.clock.campaignName }
                                    </div>
                                }
                                {
                                    this.state.isEditingTitle &&
                                    <input
                                        ref={this.titleInput}
                                        className="clock-title-input" 
                                        type="text" 
                                        name="title" 
                                        value={this.state.editTitle} 
                                        placeholder="enter campaign name..."
                                        onChange={(e) => this._editTitle(e.target.value)}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                    <AccountBox />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    app: state.app,
    alerts: state.alerts,
    clock: state.clock
});

function mapDispatchToProps(dispatch){
    return {
        changeTitle: (title) => dispatch(changeTitle(title))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);