import React, { Component } from 'react';
import Clock from './components/Clock';
import Menu from './components/Menu';
import Header from './components/Header';
import './App.css';
import './Koboldio.css';
import LocationDashboard from './components/Locations/LocationDashboard';
import { connect } from 'react-redux';
import { APP_MODES } from './constants/AppModes';
import LocationManager from './components/Locations/LocationManager';
import { loadSessionState } from './redux/actions/appActions';
import KoboldioAlert from './components/Generics/KoboldioAlert';
import CalendarManager from './components/Calendar/CalendarManager';

// Fontawesome library
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faWindowClose, 
  faTrashAlt, 
  faPlusSquare, 
  faClock,
  faBan,
  faPlayCircle,
  faHandPointRight,
  faRoute,
  faWalking,
  faArrowRight,
  faSquare,
  faSun,
  faCloudSun,
  faCloud,
  faCloudSunRain,
  faCloudShowersHeavy,
  faExclamationTriangle,
  faBolt,
  faDrumstickBite,
  faBars,
  faHome,
  faWindowMinimize,
  faWindowMaximize
} from '@fortawesome/free-solid-svg-icons';
import CharacterManager from './components/Characters/CharacterManager';
import PartyDashboard from './components/Characters/PartyDashboard';
import CalendarDashboard from './components/Calendar/CalendarDashboard';

library.add(
  faWindowClose, 
  faTrashAlt, 
  faPlusSquare, 
  faClock,
  faBan,
  faPlayCircle,
  faHandPointRight,
  faRoute,
  faWalking,
  faArrowRight,
  faSquare,
  faSun,
  faCloudSun,
  faCloud,
  faCloudSunRain,
  faCloudShowersHeavy,
  faExclamationTriangle,
  faBolt,
  faDrumstickBite,
  faBars,
  faHome,
  faClock,
  faWindowMinimize,
  faWindowMaximize
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertToggle: false
    };
  }

  componentDidMount() {
    // retrieve local storage
    const sessionState = JSON.parse(localStorage.getItem('sessionState'));

    if (sessionState) {
      this.props.loadSessionState(sessionState);
    }
  }

  componentDidUpdate(prevProps) {
    const sessionState = {
      clock: this.props.clock,
      location: this.props.location,
      weather: this.props.weather,
      character: this.props.character,
      calendar: this.props.calendar
    };
    localStorage.setItem('sessionState', JSON.stringify(sessionState));

    if (this.props.alerts.message !== prevProps.alerts.message) {
      this.setState({
          alertToggle: true
      });
    }
  }

  render(){
    return (
      <div className="App">
        <Header />
        <Menu />
        <div className="dashboard-wrapper">
          <div className="left-wing">
            {
              this.props.clock.id &&
              this.props.app.mode === APP_MODES.Clock &&  // and mode is clock
              <LocationDashboard />
            }
          </div>
          <div className="middle-col">
            <Clock
              visible={this.props.app.mode === APP_MODES.Clock}
            />
            <PartyDashboard
              visible={
                this.props.app.mode === APP_MODES.Clock &&
                this.props.clock.id
              }
            />
            <CharacterManager
              visible={this.props.app.mode === APP_MODES.CharacterManager}
            />
            <LocationManager
              visible={this.props.app.mode === APP_MODES.LocationManager}
            />
            <CalendarManager
              visible={this.props.app.mode === APP_MODES.CalendarManager}
            />
          </div>
          <div className="right-wing">
            {
              <CalendarDashboard
                visible={
                  this.props.app.mode === APP_MODES.Clock && 
                  this.props.clock.id}
              />
            }
          </div>
        </div>
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
    );
  }
}

const mapStateToProps = state => ({
  app: state.app,
  alerts: state.alerts,
  clock: state.clock,
  location: state.location,
  weather: state.weather,
  character: state.character,
  calendar: state.calendar
});

function mapDispatchToProps(dispatch) {
  return {
    loadSessionState: (sessionState) => dispatch(loadSessionState(sessionState))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
