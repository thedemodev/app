import React from 'react'
import moment from 'moment'
import withSizes from 'react-sizes'
import { compose, withProps, branch, renderComponent } from 'recompose'
import {
  ResponsiveContainer,
  ComposedChart,
  Legend,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts'
import cx from 'classnames'
import { Panel, Button, Label } from '@santiment-network/ui'
import { formatNumber } from './../../utils/formatting'
import { mergeTimeseriesByKey } from './../../utils/utils'
import mixWithPaywallArea from './../PaywallArea/PaywallArea'
import PaywallMessage from './../PaywallMessage/PaywallMessage'
import { sourcesMeta as chartsMeta } from './trendsUtils'
import { mapSizesToProps } from '../../App'
import styles from './TrendsReChart.module.scss'

const toggleCharts = Object.keys(chartsMeta).filter(key => key !== 'total')

const ASSET_PRICE_COLOR = '#A4ACB7'

const Loading = () => <h2 style={{ marginLeft: 30 }}>Loading...</h2>

const Empty = () => (
  <h2 style={{ marginLeft: 30 }}>
    We can't find any data{' '}
    <span aria-label='sadly' role='img'>
      😞
    </span>
  </h2>
)

const displayLoadingState = branch(
  props => props.isLoading,
  renderComponent(Loading)
)

const getChartMargins = isDesktop => {
  if (isDesktop) {
    return {
      top: 5,
      right: 36,
      left: 0,
      bottom: 5
    }
  }
  return {
    left: -20,
    right: 30
  }
}

const displayEmptyState = branch(props => props.isEmpty, renderComponent(Empty))

const useToggles = (defaultState = []) => {
  const [state, setState] = React.useState(defaultState)

  const setToggles = toggle => {
    setState(prevState => {
      if (prevState.includes(toggle)) {
        return prevState.filter(tog => tog !== toggle)
      }
      return [...prevState, toggle]
    })
  }

  return [state, setToggles]
}

const TrendsReChart = ({
  chartSummaryData = [],
  chartData,
  asset,
  isDesktop,
  hasPremium
}) => {
  const [disabledToggles, setDisabledToggles] = useToggles(toggleCharts)

  return (
    <div className='TrendsExploreChart'>
      {chartSummaryData
        .filter(({ index }) => !disabledToggles.includes(index))
        .map((entity, key) => (
          <Panel key={key} style={{ marginTop: '1rem' }}>
            {!hasPremium && (
              <div style={{ padding: '0.5rem' }}>
                <PaywallMessage />
              </div>
            )}
            <ResponsiveContainer width='100%' height={isDesktop ? 300 : 250}>
              <ComposedChart
                data={chartData}
                syncId='trends'
                margin={getChartMargins(isDesktop)}
              >
                <XAxis
                  dataKey='datetime'
                  tickLine={false}
                  tickMargin={5}
                  minTickGap={100}
                  tickFormatter={timeStr => moment(timeStr).format('DD MMM YY')}
                />
                <YAxis />
                <YAxis
                  yAxisId='axis-price'
                  hide
                  tickFormatter={priceUsd =>
                    formatNumber(priceUsd, { currency: 'USD' })
                  }
                  domain={['auto', 'dataMax']}
                />
                <CartesianGrid
                  vertical={false}
                  strokeDasharray='4 10'
                  stroke='#ebeef5'
                />
                <Tooltip
                  labelFormatter={date =>
                    moment(date).format('dddd, MMM DD YYYY')
                  }
                  formatter={(value, name) => {
                    if (name === `${asset}/USD`) {
                      return formatNumber(value, { currency: 'USD' })
                    }
                    return value
                  }}
                />
                <Line
                  type='linear'
                  yAxisId='axis-price'
                  name={asset + '/USD'}
                  dot={false}
                  strokeWidth={1.5}
                  dataKey='priceUsd'
                  stroke={ASSET_PRICE_COLOR}
                />
                <Line
                  type='linear'
                  dataKey={entity.index}
                  dot={false}
                  strokeWidth={entity.index === 'merged' ? 1.5 : 3}
                  name={entity.name}
                  stroke={`var(--${entity.color})`}
                />
                {!hasPremium &&
                  mixWithPaywallArea({
                    dataKey: entity.index,
                    stroke: '#ffad4d',
                    strokeOpacity: 0.9,
                    data: chartData
                  })}
                <Legend />
              </ComposedChart>
            </ResponsiveContainer>
          </Panel>
        ))}
      <div className={styles.toggles}>
        {toggleCharts.map(key => {
          const { index, name, color } = chartsMeta[key]
          return (
            <Button
              key={index}
              onClick={() => setDisabledToggles(index)}
              className={cx(
                styles.toggle,
                !disabledToggles.includes(index) && styles.toggle_active
              )}
              border
            >
              <Label className={styles.label} accent={color} variant='circle' />{' '}
              {name}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

TrendsReChart.defaultProps = {
  data: {},
  isLoading: true
}

const cleanLastDate = (data, hasPremium) => {
  if (hasPremium) {
    return data
  }
  const {
    reddit,
    telegram,
    professional_traders_chat,
    discord,
    ...last
  } = data[data.length - 1]
  return [...data.filter((_, index) => index < data.length - 1), last]
}

export const addTotal = (
  chartData,
  channels = ['reddit', 'telegram', 'discord', 'professional_traders_chat']
) => {
  return chartData.reduce((acc, item) => {
    const total = channels.reduce((acc, channelName) => {
      acc += item[channelName] ? item[channelName] : 0
      return acc
    }, 0)
    acc.push({ total, ...item })
    return acc
  }, [])
}

const getTimeseries = (sourceName, trends) =>
  ((trends.sources || {})[sourceName] || []).map(el => {
    return {
      datetime: el.datetime,
      [sourceName]: el.mentionsCount
    }
  })

export const calcSumOfMentions = chartsMeta => data => {
  const channels = [
    'reddit',
    'telegram',
    'discord',
    'professional_traders_chat',
    'total'
  ]
  return data.reduce(
    (acc, val) => {
      channels.forEach(channelName => {
        if (val[channelName]) {
          acc[channelName] = {
            ...acc[channelName],
            value: acc[channelName].value + val[channelName]
          }
        }
      })
      return acc
    },
    { ...chartsMeta }
  )
}

const cleanAllZeroSources = data => data.filter(source => source.value > 0)

const objToArr = data => {
  return Object.keys(data).map(key => data[key])
}

export default compose(
  withProps(({ data = {}, trends, hasPremium = false }) => {
    const { items = [], isLoading = true } = data
    const telegram = getTimeseries('telegram', trends)
    const reddit = getTimeseries('reddit', trends)
    const professional_traders_chat = getTimeseries(
      'professional_traders_chat',
      trends
    )
    const discord = getTimeseries('discord', trends)

    if (trends.isLoading || isLoading) {
      return { isLoading: true }
    }

    const _chartData = mergeTimeseriesByKey({
      timeseries: [items, telegram, reddit, professional_traders_chat, discord],
      key: 'datetime'
    })
    const chartData = addTotal(cleanLastDate(_chartData, hasPremium))

    if (
      telegram.length === 0 &&
      reddit.length === 0 &&
      professional_traders_chat.length === 0 &&
      discord.length === 0
    ) {
      return {
        isEmpty: true
      }
    }

    const chartSummaryData = compose(
      cleanAllZeroSources,
      objToArr,
      calcSumOfMentions(chartsMeta)
    )(chartData)

    chartSummaryData.forEach(({ index }) => {
      chartData.forEach(data => {
        if (
          moment(data.datetime).isBefore(
            moment()
              .startOf('day')
              .toISOString()
          )
        ) {
          if (data[index] === undefined) {
            data[index] = 0
          }
        }
      })
    })
    return {
      chartData,
      chartSummaryData,
      isLoading: false
    }
  }),
  withSizes(mapSizesToProps),
  displayLoadingState,
  displayEmptyState
)(TrendsReChart)
