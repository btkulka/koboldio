import React from 'react';
import Clock from './components/Clock';
import Menu from './components/Menu';
import Header from './components/Header';
import './App.css';
import './Koboldio.css';

// Fontawesome library
import { library } from '@fortawesome/fontawesome-svg-core';
import { faWindowClose, faTrashAlt, faPlusSquare, faClock } from '@fortawesome/free-solid-svg-icons';
import WeatherDashboard from './components/Weather/WeatherDashboard';
library.add(faWindowClose, faTrashAlt, faPlusSquare, faClock);

function App() {
  return (
    <div className="App">
      <Header />
      <Menu />
      <div className="dashboard-wrapper">
        <Clock />
      </div>
    </div>
  );
}

export default App;
