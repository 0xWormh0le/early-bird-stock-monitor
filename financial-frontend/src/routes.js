import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux'
import { Router, Route, Redirect } from 'react-router-dom';
import { createStructuredSelector } from 'reselect'
import { authSelector } from 'redux/modules/auth/selectors'
import { logout } from 'redux/modules/auth/actions'

import App from './App';
import Home from 'pages/Home';
import Signup from 'pages/Signup';

function Routes({ history, auth, logout }) {
  const redirect = () => {
    if (auth.isAuthenticated) {
      return <Redirect to='/home' />
    } else {
      return <Redirect to='/signup' />
    }
  }

  return (
    <Router history={history}>
      <App>
        <Route path='/home' component={Home} />
        <Route path='/signup' component={Signup} />
        <Route path='/' exact render={redirect} />
      </App>
    </Router>
  )
}

const selectors = createStructuredSelector({
  auth: authSelector
})

const actions = {
  logout
}

export default compose(
  connect(selectors, actions)
)(Routes)
