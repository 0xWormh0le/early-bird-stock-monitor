import { takeLatest, takeEvery } from 'redux-saga/effects'

import { apiCallSaga } from '../api'
import { PING, GET_LATEST, GET_UPGAPPERS, GET_AFTER_HOURS } from './types'

const ping = apiCallSaga({
  type: PING,
  method: 'post',
  path: '/ping',
  selectorKey: 'ping',
})

const getLatest = apiCallSaga({
  type: GET_LATEST,
  method: 'get',
  path: '/stock/latest',
  selectorKey: 'latest',
})

const getUpGappers = apiCallSaga({
  type: GET_UPGAPPERS,
  method: 'get',
  path: '/stock/up-gappers',
  selectorKey: 'upGappers',
})

const getAfterHours = apiCallSaga({
  type: GET_AFTER_HOURS,
  method: 'get',
  path: '/stock/after-hours',
  selectorKey: 'afterHours',
})

export default function* rootSaga() {
  yield takeLatest(PING, ping)
  yield takeEvery(GET_LATEST, getLatest)
  yield takeLatest(GET_UPGAPPERS, getUpGappers)
  yield takeLatest(GET_AFTER_HOURS, getAfterHours)
}
