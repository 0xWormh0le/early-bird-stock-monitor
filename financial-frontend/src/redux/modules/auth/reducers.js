import { handleActions } from 'redux-actions'

import * as types from './types'
import { loadData } from 'utils/storage'

const getInitialState = () => {
  const { authToken } = loadData()
  return {
    isAuthenticated: !!authToken,
    authToken: authToken,
  }
}

export default handleActions(
  {
    [types.AUTH_SIGNUP_SUCCESS]: (state, { payload }) => ({
      ...state,
      isAuthenticated: true,
      profile: payload.profile,
      authToken: payload.token,
    }),
    [types.AUTH_SIGNUP_FAIL]: (state, { payload }) => ({
      ...state,
      isAuthenticated: false,
      authToken: null,
    }),
    [types.AUTH_LOGOUT]: (state, { payload }) => ({
      ...state,
      isAuthenticated: false,
      authToken: null,
    })
  },
  getInitialState()
)
