import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import './index.css';
import Router from './Router';
// import registerServiceWorker from './registerServiceWorker';
import store from './store'

window.app = {}
window.app.api_domain = 'http://47.95.7.10:8080'

ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById('root')
);
// registerServiceWorker();
