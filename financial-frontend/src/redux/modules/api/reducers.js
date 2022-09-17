import setWith from 'lodash/setWith'
import unset from 'lodash/unset'
import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions'

import { REQUEST_SUCCESS, REQUEST_REJECTED, REQUEST_PENDING } from './types'
import { AUTH_SIGNUP_SUCCESS } from '../auth/types'

export const requests = handleActions(
  {
    [REQUEST_PENDING]: (state, { payload }) => {
      const selectorKey = payload.requestSelectorKey || payload.selectorKey
      return {
        ...state,
        [selectorKey]: {
          ...state[selectorKey],
          [payload.method]: REQUEST_PENDING
        }
      }
    },

    [REQUEST_SUCCESS]: (state, { payload }) => {
      const selectorKey = payload.requestSelectorKey || payload.selectorKey
      return {
        ...state,
        [selectorKey]: {
          ...state[selectorKey],
          [payload.method]: REQUEST_SUCCESS
        }
      }
    },

    [REQUEST_REJECTED]: (state, { payload }) => {
      const selectorKey = payload.requestSelectorKey || payload.selectorKey
      return {
        ...state,
        [selectorKey]: {
          ...state[selectorKey],
          [payload.method]: REQUEST_REJECTED
        }
      }
    }
  },
  {}
)

// TODO: find a better way to resolve cloning issue
const cloneInPath = (state, path) => {
  if (!path) return state
  const pathArray = Array.isArray(path) ? path : path.split('.')
  pathArray.reduce((subState, path) => {
    subState[path] = Array.isArray(subState[path]) ? [...subState[path]] : { ...subState[path] }
    return subState[path]
  }, state)
  return { ...state }
}

export const data = handleActions(
  {
    [AUTH_SIGNUP_SUCCESS]: (state, { payload }) => ({
      ...state,
      profile: payload.profile
    }),

    [REQUEST_SUCCESS]: (state, { payload }) => {
      return cloneInPath(setWith(state, payload.selectorKey, payload.data, Object), payload.selectorKey)
    },

    [REQUEST_REJECTED]: (state, { payload }) => {
      if (payload.method.toLowerCase() === 'get') {
        unset(state, payload.selectorKey)
      }
      return state
    }
  },
  {}
)

export default combineReducers({
  data,
  requests
})
