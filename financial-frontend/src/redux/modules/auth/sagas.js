import { put, takeLatest } from 'redux-saga/effects'

import { apiCallSaga } from '../api'
import { AUTH_SIGNUP, AUTH_LOGOUT } from './types'
import { signupSuccess, signupFail } from './actions'
import { saveData } from 'utils/storage'

const signup = apiCallSaga({
  type: AUTH_SIGNUP,
  method: 'post',
  path: '/auth/register',
  selectorKey: 'register',
  success: function*(payload) {
    saveData({ authToken: payload.token })
    yield put(signupSuccess(payload))
  },
  fail: function*(payload) {
    yield put(signupFail(payload))
  }
})

const logout = function* () {
  yield saveData({ authToken: null })
}

export default function* rootSaga() {
  yield takeLatest(AUTH_SIGNUP, signup)
  yield takeLatest(AUTH_LOGOUT, logout)
}
