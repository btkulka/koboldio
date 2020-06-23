import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import koboldioReducer from './redux/reducers/koboldioReducer';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { clockMiddleware } from './redux/middleware/clockMiddleware';
import { locationsMiddleware } from './redux/middleware/locationsMiddleware';

const middleware = applyMiddleware(
  clockMiddleware, locationsMiddleware
);
const store = createStore(koboldioReducer, middleware);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App id="app" />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
