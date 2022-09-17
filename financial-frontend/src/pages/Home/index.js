import React, { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect'
import cn from 'classnames'
import { FormattedNumber } from 'react-intl'
import orderBy from 'lodash/orderBy'
import moment from 'moment-timezone'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Loader from 'components/Loader'
import { ping, getLatest, getUpGappers, getAfterHours } from 'redux/modules/stock/actions'
import { latestStockDataSelector, upGappersStockDataSelector, afterHoursStockDataSelector } from 'redux/modules/stock/selectors'
import { profileSelector } from 'redux/modules/auth/selectors'

import './styles.scss'

const thousand =  1000

const million = 1000 * 1000

const billion = 1000 * 1000 * 1000

const approxValue = x => {
  if (x >= billion) {
    return x / billion
  } else if (x >= million) {
    return x / million
  } else {
    return x / thousand
  }
}

const approxUnit = x => {
  if (x >= billion) {
    return 'B'
  } else if (x >= million) {
    return 'M'
  } else {
    return 'K'
  }
}

const PERIOD = {
  upGappers: 0,
  afterHours: 1,
  none: 2,
}

const timezone = 'America/New_York'

function WaitBox({ type, className }) {
  const date = moment().subtract(1, 'days').tz(timezone).format('MMM DD YYYY')
  const title = {
    [PERIOD.upGappers]: `Data from 4AM - 4PM on ${date}`,
    [PERIOD.afterHours]: `Data from 4PM - 8PM on ${date}`
  }
  const content = {
    [PERIOD.upGappers]: 'Up Gappers will begin to populate new data at 4AM.',
    [PERIOD.afterHours]: 'After Hours will begin to populate new date at 4PM.'
  }

  return (
    <div className={cn('WaitBox p-3', className)}>
      <p className='WaitBox__Title mb-0 text-white font-large'>{title[type]}</p>
      <p className='mb-0'>{content[type]}</p>
    </div>
  )
}

function Home(props) {
  const {
    ping,
    getLatest,
    getUpGappers,
    getAfterHours,
    profile,
    latestData,
    upGappersData,
    afterHoursData
  } = props

  const [now, setNow] = useState(null)
  const [wait, setWait] = useState(PERIOD.none)
  const [period, setPeriod] = useState(PERIOD.none)

  const setNowFunc = () => {
    const format = 'hh:mm:ss'
    const estTime = moment().tz(timezone)
    const upGappers = [moment('04:00:00', format), moment('16:00:00', format)]
    const afterHours = [moment('16:00:00', format), moment('20:00:00', format)]
    const now =
      estTime.isBetween(upGappers[0], upGappers[1]) ? PERIOD.upGappers
      : estTime.isBetween(afterHours[0], afterHours[1]) ? PERIOD.afterHours
      : PERIOD.none

    const upGapperWait = [moment('00:00:00', format), moment('04:00:00', format)]
    const afterHoursWait = [moment('00:00:00', format), moment('16:00:00', format)]

    const wait =
      estTime.isBetween(upGapperWait[0], upGapperWait[1]) ? PERIOD.upGappers
      : estTime.isBetween(afterHoursWait[0], afterHoursWait[1]) ? PERIOD.afterHours
      : PERIOD.none

    setNow(now)
    setWait(wait)
    
    return now
  }

  const stockData = useCallback(() => {
    let stockData = latestData
    if (now !== period) {
      if (period === PERIOD.afterHours) {
        stockData = afterHoursData
      } else if (period === PERIOD.upGappers) {
       stockData = upGappersData
      }
    }
    return orderBy(stockData, ['changePercent'], ['desc'])
  }, [now, period, latestData, afterHoursData, upGappersData])
  
  useEffect(() => {
    setNowFunc()
    
    const dataTimer = setInterval(getLatest, process.env.REACT_APP_DATA_INTERVAL, 'quote')
    const pingTimer = setInterval(ping, process.env.REACT_APP_PING_INTERVAL)
    const nowTimer = setInterval(setNowFunc, 1000)

    return () => {
      clearTimeout(dataTimer)
      clearTimeout(pingTimer)
      clearTimeout(nowTimer)
    }
  }, [ping, getLatest])

  useEffect(() => {
    if (now !== null) {
      setPeriod(now)
      getUpGappers()
      getAfterHours()
      getLatest()
    }
  }, [now, getLatest, getUpGappers, getAfterHours])

  const handlePeriodClick = value => () => {
    if (value !== period) {
      setPeriod(value)
    } else if (now === PERIOD.none) {
      setPeriod(now)
    }
  }

  return (
    <div className='Home'>
      {wait !== PERIOD.none && period === wait && <WaitBox type={wait} />}
      {latestData.length === 0 && (
        <Loader size={15} className='Home__Loader' />
      )}

      <div className='p-2'>
        <div className='text-center position-relative'>
          <Button
            className={period === PERIOD.upGappers ? 'Home__Period--active' : 'Home__Period'}
            onClick={handlePeriodClick(PERIOD.upGappers)}
          >
            Up Gappers
          </Button>
          <Button
            className={cn('ml-2', period === PERIOD.afterHours ? 'Home__Period--active' : 'Home__Period')}
            onClick={handlePeriodClick(PERIOD.afterHours)}
          >
            After Hours
          </Button>
          <div className="text-white Home__Avatar">
            {profile && profile.name}
          </div>
        </div>
      </div>
      <div className='Home__Stock-data'>
        <Table className='Home__Stock-table mb-0'>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Price</th>
              <th>$ Change</th>
              <th>% Change</th>
              <th>Volume</th>
              <th>Avg Vol(5D)</th>
              <th>Float</th>
              <th>Mkt Cap</th>
            </tr>
          </thead>
          <tbody>
            {stockData().map(item => (
              <tr key={item.symbol}>
                <td>
                  <span className='Home__Stock-acronym'>
                    {item.symbol}
                  </span>
                  <br/>
                  <span title={item.company}>{item.company}</span>
                </td>
                <td>
                  <FormattedNumber value={item.price} format='fractionDigitMedium' />
                </td>
                <td>
                  {item.changePrice > 0 && '+' }
                  <FormattedNumber value={item.changePrice} format='fractionDigitMedium' />
                </td>
                <td>
                  {item.changePercent > 0 && '+' }
                  <FormattedNumber value={item.changePercent} format='percent' />
                </td>
                <td>
                  <FormattedNumber value={approxValue(item.volume)} format='fractionDigitMedium' />
                  {approxUnit(item.volume)}
                </td>
                <td>
                  <FormattedNumber value={item.avgVol5d} format='fractionDigitNone' />
                </td>
                <td>
                  <FormattedNumber value={approxValue(item.float)} format='fractionDigitMedium' />
                  {approxUnit(item.float)}
                </td>
                <td>
                  <FormattedNumber value={approxValue(item.marketCap)} format='fractionDigitMedium' />
                  {approxUnit(item.marketCap)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

const selectors = createStructuredSelector({
  profile: profileSelector,
  latestData: latestStockDataSelector,
  upGappersData: upGappersStockDataSelector,
  afterHoursData: afterHoursStockDataSelector
});

const actions = {
  ping,
  getLatest,
  getUpGappers,
  getAfterHours
}

export default connect(selectors, actions)(Home)
