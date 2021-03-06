import React from 'react'
import cx from 'classnames'
import WithLikesMutation from '../Like/WithLikesMutation'
import InsightCard from './InsightCardWithMarketcap'
import Feed from '../Feed/Feed'

const InsightsFeed = ({
  insights,
  dateKey = 'createdAt',
  isAllInsightsPage,
  classes = {}
}) => {
  return (
    <WithLikesMutation>
      {mutateInsightById => (
        <Feed
          isAllInsightsPage={isAllInsightsPage}
          data={insights}
          component={({ id, className, ...rest }) => (
            <InsightCard
              id={id}
              {...rest}
              className={cx(className, classes.insightCard)}
              onLike={mutateInsightById(id)}
            />
          )}
          dateKey={dateKey}
        />
      )}
    </WithLikesMutation>
  )
}

export default InsightsFeed
