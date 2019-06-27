import React from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { TOTAL_TYPES } from './list-info-constants'
import {
  totalMarketcapGQL,
  projectsListHistoryStatsGQL
} from './TotalMarketcapGQL'
import ListInfoWidget from './ListInfoWidget'
import { filterEmptyStats } from './utils'

const getMarketcapQuery = ({ type, projects, range }) => {
  const { from, to } = range.method

  const slugsQueryTotal = graphql(totalMarketcapGQL, {
    props: ({ data: { historyPrice = [], loading: isLoading } }) => ({
      historyPrice: filterEmptyStats(historyPrice),
      isLoading
    }),
    options: () => ({
      variables: {
        from: from.toISOString(),
        to: to.toISOString(),
        interval: range.interval,
        slug: TOTAL_TYPES[type]
      }
    })
  })

  if (TOTAL_TYPES[type]) return slugsQueryTotal

  return graphql(projectsListHistoryStatsGQL, {
    props: ({
      data: { projectsListHistoryStats = [], loading: isLoading }
    }) => ({
      historyPrice: filterEmptyStats(projectsListHistoryStats),
      isLoading
    }),
    options: () => ({
      variables: {
        from: from.toISOString(),
        to: to.toISOString(),
        slugs: projects.map(({ slug }) => slug),
        interval: range.interval
      }
    })
  })
}

const GetListInfo = ({ type, from, projects, range, ...rest }) => {
  if (range) {
    const resultQuery = getMarketcapQuery({ type, projects, range })
    const HistoryQuery = resultQuery(ListInfoWidget)
    return (
      <HistoryQuery
        {...rest}
        type={TOTAL_TYPES[type] ? 'Total' : 'Watchlist'}
        interval={range.value}
      />
    )
  } else return null
}

const mapStateToProps = ({ projects: { items } }) => ({ projects: items })

export default connect(mapStateToProps)(GetListInfo)
