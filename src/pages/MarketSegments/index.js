import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Tabs from '@santiment-network/ui/Tabs'
import ChartWidget from '../../ducks/SANCharts/ChartPage'
import AssetsTable from '../assets/AssetsTable'
import { CATEGORIES_SETTINGS } from '../assets/asset-columns'
import { getMarketSegment } from '../../ducks/SANCharts/utils'
import { MARKET_SEGMENTS_FETCH } from './actions'
import styles from './index.module.scss'

const hideSettings = {
  header: true,
  metricSelector: true,
  sidecar: true
}

const SEGMENTS = [
  getMarketSegment('Ethereum'),
  getMarketSegment('DeFi'),
  getMarketSegment('EOS')
]

const TABS = ['Ethereum', 'DeFi', 'EOS']

const MarketSegmentsPage = ({
  assets,
  loading,
  isLoggedIn,
  location,
  history,
  fetchAssets,
  timestamp = Date.now()
}) => {
  const [segment, setSegment] = useState('DeFi')

  function changeSegment (segment) {
    setSegment(segment)
  }

  function refetchAssets () {
    fetchAssets({ segment, forced: true })
  }

  useEffect(
    () => {
      fetchAssets({ segment })
    },
    [segment]
  )

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.content + ' page'}>
          <h2 className={styles.title}>Buidl heroes</h2>
          <ChartWidget
            enabledViewOnlySharing={false}
            adjustNightMode={false}
            showToggleAnomalies={false}
            metrics={[]}
            marketSegments={SEGMENTS}
            interval='1d'
            classes={styles}
            isLoggedIn={isLoggedIn}
            isControlled
            hideSettings={hideSettings}
            hasPremium={true}
            isPRO={true}
            leftBoundaryDate={false}
            rightBoundaryDate={false}
          />
          <Tabs
            options={TABS}
            defaultSelectedIndex={segment}
            onSelect={changeSegment}
            className={styles.tabs}
          />
          <AssetsTable
            items={assets}
            Assets={{ typeInfo: '', isLoading: loading, timestamp }}
            listName='Market Segments'
            settings={CATEGORIES_SETTINGS}
            showCollumnsToggle={false}
            refetchAssets={refetchAssets}
            className={styles.table}
          />
        </div>
      </div>
    </>
  )
}

const mapStateToProps = state => ({
  ...state.marketSegments
})

const mapDispatchToProps = dispatch => ({
  fetchAssets: payload =>
    dispatch({
      type: MARKET_SEGMENTS_FETCH,
      payload
    })
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MarketSegmentsPage)