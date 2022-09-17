import { createAction } from 'redux-actions'

import * as types from './types'

export const signup = createAction(types.AUTH_SIGNUP)

export const signupSuccess = createAction(types.AUTH_SIGNUP_SUCCESS)

export const signupFail = createAction(types.AUTH_SIGNUP_FAIL)

export const logout = createAction(types.AUTH_LOGOUT)
