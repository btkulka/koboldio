import React, { Component } from 'react';
import Clock from './components/Clock';
import Menu from './components/Menu';
import Header from './components/Header';
import './App.css';
import './Koboldio.css';

// Fontawesome library
import { library } from '@fortawesome/fontawesome-svg-core';
import { faWindowClose, faTrashAlt, faPlusSquare, faClock } from '@fortawesome/free-solid-svg-icons';
import WeatherDashboard from './components/Weather/WeatherDashboard';
import { connect } from 'react-redux';
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
            this.props.clock.id &&  // if game has been saved
            <WeatherDashboard />
          }
          <Clock />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  clock: state.clock
});

function mapDispatchToProps(dispatch) {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
