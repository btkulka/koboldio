import React, { Component } from 'react';
import Clock from './components/Clock';
import Menu from './components/Menu';
import Header from './components/Header';
import './App.css';
import './Koboldio.css';
import WeatherDashboard from './components/Weather/WeatherDashboard';
import { connect } from 'react-redux';
import { APP_MODES } from './constants/AppModes';
import LocationManager from './components/Locations/LocationManager';

// Fontawesome library
import { library } from '@fortawesome/fontawesome-svg-core';
import { faWindowClose, faTrashAlt, faPlusSquare, faClock } from '@fortawesome/free-solid-svg-icons';
library.add(faWindowClose, faTrashAlt, faPlusSquare, faClock);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render(){
    return (
      <div className="App">
        <Header />
        <Menu />
        <div className="dashboard-wrapper">
          {
            this.props.clock.id && // if game has been saved
            this.props.app.mode === APP_MODES.Clock &&  // and mode is clock
            <WeatherDashboard />
          }
          <Clock
            visible={this.props.app.mode === APP_MODES.Clock}
          />
          <LocationManager
            visible={this.props.app.mode === APP_MODES.LocationManager}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  app: state.app,
  clock: state.clock
});

function mapDispatchToProps(dispatch) {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
