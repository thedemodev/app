import React from 'react'
import { YAxis, Bar, Line } from 'recharts'

export const Metrics = {
  price: {
    node: Line,
    color: 'jungle-green',
    label: 'Price'
  },
  socialVolume: {
    node: Line,
    color: 'persimmon',
    label: 'Social Volume'
  },
  tokenAgeConsumed: {
    node: Bar,
    color: 'texas-rose',
    label: 'Token Age Consumed',
    fill: true
  },
  exchangeFundsFlow: {
    node: Line,
    color: 'heliotrope',
    label: 'Exchange Flow Balance',
    dataKey: 'inOutDifference'
  }
}

export const getMetricCssVarColor = metric => `var(--${Metrics[metric].color})`

export const generateMetricsMarkup = metrics => {
  return metrics
    .filter(metric => metric !== 'price')
    .reduce((acc, metric) => {
      const { node: El, label, color, dataKey = metric } = Metrics[metric]
      const rest = {
        [El === Bar ? 'fill' : 'stroke']: `var(--${color})`
      }
      acc.push(
        <YAxis
          key={`axis-${metric}`}
          yAxisId={`axis-${metric}`}
          type='number'
          domain={['auto', 'dataMax']}
          hide
        />,
        <El
          key={`line-${metric}`}
          type='linear'
          yAxisId={`axis-${metric}`}
          name={label}
          strokeWidth={1.5}
          dataKey={dataKey}
          dot={false}
          isAnimationActive={false}
          {...rest}
        />
      )
      return acc
    }, [])
}
