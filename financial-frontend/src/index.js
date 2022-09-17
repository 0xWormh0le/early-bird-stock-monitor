import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'

import * as serviceWorker from './serviceWorker'
import store, { history } from './redux/store'
import Routes from './routes'

import intlConfig from 'config/intl'
import './styles/styles.scss'

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider {...intlConfig}>
      <Routes history={history} />
    </IntlProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
