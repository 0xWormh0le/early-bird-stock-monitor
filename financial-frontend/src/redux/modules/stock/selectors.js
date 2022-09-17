import fp from 'lodash/fp'
import { dataSelector } from '../api'

const subSelector = (subname, defaultValue = null) =>
  fp.compose(
    fp.defaultTo(defaultValue),
    fp.get(subname),
    fp.get('stock')
  )

export const latestStockDataSelector = dataSelector('latest', [])

export const upGappersStockDataSelector = dataSelector('upGappers', [])

export const afterHoursStockDataSelector = dataSelector('afterHours', [])
