import React, { Fragment } from 'react'
import moment from 'moment'
import InsightsFeatured from '../Insight/InsightsFeatured'
import styles from './Feed.module.scss'

const FeaturedInsightsBlock = ({ maxLines }) => (
  <section className={styles.featuredInsights}>
    <h4 className={styles.featuredInsights__title}>Featured insights</h4>
    <div className={styles.featuredInsights__wrapper}>
      <div className={styles.featuredInsights__scrollableWrapper}>
        <div className={styles.featuredInsights__scrollable}>
          <InsightsFeatured
            maxLines={maxLines}
            className={styles.featuredInsights__card}
          />
        </div>
      </div>
    </div>
  </section>
)

const Feed = ({ component: El, data, dateKey, isDesktop }) => {
  let lastDateKey
  return data.map((item, index) => {
    const id = item.id || index
    const date = moment(item[dateKey]).format('MMM D')
    const isNotSameAsLastDate = date !== lastDateKey

    if (isNotSameAsLastDate) {
      lastDateKey = date
    }

    return (
      <Fragment key={id}>
        {isNotSameAsLastDate && <h4 className={styles.date}>{date}</h4>}
        <El className={styles.signal} {...item} />
        {index === 2 && !isDesktop && <FeaturedInsightsBlock maxLines={3} />}
      </Fragment>
    )
  })
}

export default Feed
