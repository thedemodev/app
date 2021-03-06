import React from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceDot
} from 'recharts'
import cx from 'classnames'
import Gradients from '../../../components/WatchlistOverview/Gradients'
import { generateMetricsMarkup } from './../../SANCharts/utils'
import CustomTooltip from './../../SANCharts/CustomTooltip'
import chartStyles from './../../SANCharts/Chart.module.scss'
import sharedStyles from './../../SANCharts/ChartPage.module.scss'
import styles from './SignalPreview.module.scss'

export function GetReferenceDots (signals, yAxisId) {
  return signals.map(({ date, yCoord }, idx) => (
    <ReferenceDot
      x={date}
      y={yCoord}
      yAxisId={yAxisId}
      key={idx}
      ifOverflow='extendDomain'
      r={3}
      isFront
      stroke='var(--white)'
      strokeWidth='2px'
      fill='var(--persimmon)'
    />
  ))
}

const VisualBacktestChart = ({
  triggeredSignals,
  metrics,
  label,
  data,
  dataKeys,
  referenceDots,
  syncedColors,
  showTitle
}) => {
  const markup = generateMetricsMarkup(metrics, { syncedColors })

  const renderChart = () => {
    return (
      <ComposedChart data={data} margin={{ left: 0, right: 0 }}>
        <defs>
          <Gradients />
        </defs>
        <XAxis
          dataKey='datetime'
          type='number'
          scale='time'
          tick={false}
          allowDataOverflow
          domain={['dataMin', 'dataMax']}
          hide
        />
        <YAxis
          hide
          domain={['auto', 'dataMax']}
          dataKey={dataKeys.dataKey}
          interval='preserveStartEnd'
        />

        {markup}

        {referenceDots}
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: 'var(--casper)' }}
          position={{ x: 0, y: -22 }}
          isAnimationActive={false}
        />
      </ComposedChart>
    )
  }

  return (
    <div className={styles.preview}>
      {showTitle && (
        <div className={styles.description}>
          <span className={styles.fired}>Signal was fired:</span>
          <span className={styles.times}>
            {triggeredSignals.length} times in {label}
          </span>
        </div>
      )}
      <div className={styles.chartBlock}>
        <div className={styles.chart}>
          <div
            className={cx(
              chartStyles.wrapper,
              sharedStyles.chart,
              styles.wrapper
            )}
          >
            <ResponsiveContainer width='100%' height={120}>
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VisualBacktestChart
