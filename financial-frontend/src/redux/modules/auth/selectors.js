import { dataSelector, isRequestPending } from '../api'
import fp from 'lodash/fp'

export const authSelector = fp.get('auth')

export const profileSelector = fp.compose(fp.get('profile'), authSelector)

export const tokenSelector = fp.compose(fp.get('authToken'), authSelector)
