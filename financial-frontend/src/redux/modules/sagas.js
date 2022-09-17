import { all, call } from 'redux-saga/effects';
import { sagas as auth } from './auth';
import { sagas as stock } from './stock';

export default function* rootSaga() {
  yield all([
    call(auth),
    call(stock)
  ])
}
