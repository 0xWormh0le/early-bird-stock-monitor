import { createAction } from 'redux-actions'

import * as types from './types'

export const ping = createAction(types.PING)

export const getLatest = createAction(types.GET_LATEST)

export const getUpGappers = createAction(types.GET_UPGAPPERS)

export const getAfterHours = createAction(types.GET_AFTER_HOURS)