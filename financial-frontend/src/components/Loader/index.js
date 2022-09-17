import React from 'react'
import cn from 'classnames'
import { css } from 'emotion'
import BeatLoader from 'react-spinners/BeatLoader'

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 150px;
`

const Loader = ({ size, loading, color, className }) => (
  <div className={cn('Loader text-center', className)}>
    <BeatLoader
      className={override}
      sizeUnit={'px'}
      size={size || 8}
      color={color || '#437fad'}
      loading={loading}
    />
  </div>
)

export default Loader
