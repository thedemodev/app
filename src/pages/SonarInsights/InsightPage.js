import React from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { Redirect } from 'react-router-dom'
import Loadable from 'react-loadable'
import PageLoader from '../../components/PageLoader'
import InsightsEditor from './InsightsEditor'
import { INSIGHT_BY_ID_QUERY } from './InsightsGQL'

const LoadableInsightCreationPage = Loadable({
  loader: () => import('./InsightsEditorPage'),
  loading: () => <PageLoader />
})

const LoadableInsightViewPage = Loadable({
  loader: () => import('./InsightViewPage'),
  loading: () => <PageLoader />
})

const isInsightADraftByDifferentUser = ({ readyState, user: { id } }, userId) =>
  readyState === 'draft' && id !== userId

const InsightPage = ({
  data,
  userId,
  match: {
    path,
    params: { id }
  }
}) => {
  if (data.loading) return null

  if (isInsightADraftByDifferentUser(data.insight, userId)) {
    console.log('Author of the draft is not current user')
    return <Redirect to='/insights-sonar' />
  }

  const isEditLocation = path.includes('/edit/')
  if (isEditLocation && data.insight.readyState !== 'draft') {
    console.log(data.insight.readyState)
    return <Redirect to={`/insights-sonar/${id}`} />
  }

  const View = isEditLocation
    ? LoadableInsightCreationPage
    : LoadableInsightViewPage

  return <View readOnly={!isEditLocation} {...data.insight} />
}

const mapStateToProps = ({ user: { data } }) => ({
  userId: data.id
})

const enhance = compose(
  connect(mapStateToProps),
  graphql(INSIGHT_BY_ID_QUERY, {
    skip: ({
      match: {
        params: { id }
      },
      userId
    }) => {
      return !userId || !Number.isInteger(+id)
    },
    options: ({
      match: {
        params: { id }
      }
    }) => ({
      variables: {
        id: +id
      }
    })
  })
)

export default enhance(InsightPage)
