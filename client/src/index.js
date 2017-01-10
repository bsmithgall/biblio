import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import createLogger from 'redux-logger'
import thunk from 'redux-thunk'

import App from './app';
import reducers from './reducers'

const middleware = [ thunk ]
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

const store = createStore(
  reducers,
  applyMiddleware(...middleware)
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
