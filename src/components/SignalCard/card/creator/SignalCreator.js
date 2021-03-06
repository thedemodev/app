import React from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import { dateDifferenceInWordsString } from '../../../../utils/dates'
import UserAvatar from '../../../../pages/Account/avatar/UserAvatar'
import styles from './SignalCreator.module.scss'

const SignalCreator = ({ date, user: { id, username, avatarUrl } = {} }) => {
  return (
    <div className={styles.container}>
      {id && (
        <UserAvatar isExternal externalAvatarUrl={avatarUrl} classes={styles} />
      )}
      <div className={cx(styles.right, !id && styles.withoutUser)}>
        {username && (
          <Link to={`/profile/${id}`} className={styles.name}>
            {username}
          </Link>
        )}
        {date && (
          <div className={styles.fromDate}>
            {dateDifferenceInWordsString(date)}
          </div>
        )}
      </div>
    </div>
  )
}

export default SignalCreator
