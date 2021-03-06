import React, { Fragment } from 'react'
import cx from 'classnames'
import { FadeIn } from 'animate-components'
import styles from './WidgetTrend.module.scss'

const Message = {
  initial: 'Choose any word to see its social context',
  isLoading: 'Loading...',
  hasNoData: 'No data in last 48 hours...'
}

const getMessage = ({ initial, isLoading, hasNoData }) => {
  if (isLoading) {
    return Message.isLoading
  }

  if (initial) {
    return Message.initial
  }

  if (hasNoData) {
    return Message.hasNoData
  }

  return undefined
}

const WidgetTrend = ({
  trendWord,
  description,
  isLoading,
  hasData,
  error,
  children,
  className,
  infoClassName
}) => {
  const msg = getMessage({
    isLoading,
    hasNoData: error || !hasData,
    initial: !trendWord && !error
  })

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {msg ? (
        <FadeIn
          className={styles.container}
          duration='1s'
          timingFunction='ease-out'
        >
          <h3 className={styles.msg}>{msg}</h3>
        </FadeIn>
      ) : (
        <Fragment>
          <div className={cx(styles.info, infoClassName)}>
            <span className={styles.word}>{trendWord} </span>
            {description}
          </div>
          <div className={styles.content}>{children}</div>
        </Fragment>
      )}
    </div>
  )
}

WidgetTrend.defaultProps = {
  className: ''
}

export default WidgetTrend
