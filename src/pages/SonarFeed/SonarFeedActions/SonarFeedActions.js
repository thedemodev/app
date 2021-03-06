import React, { useState } from 'react'
import cx from 'classnames'
import Select from '@santiment-network/ui/Search/Select/Select'
import './../../../components/formik-santiment-ui/FormikSelect.scss'
import styles from './SonarFeedActions.module.scss'

export const NEWEST_FILTER = {
  value: '0',
  label: 'Newest'
}

export const OLDEST_FILTER = {
  value: '1',
  label: 'Oldest'
}

export const FILTER_OPTIONS = [NEWEST_FILTER, OLDEST_FILTER]

const SonarFeedActions = ({ onChangeFilter, className }) => {
  const [filterValue, setFilterValue] = useState(NEWEST_FILTER)

  return (
    <div className={cx(styles.container, className)}>
      <div className={styles.select}>
        <Select
          className='select__container-single'
          clearable={false}
          value={filterValue}
          options={FILTER_OPTIONS}
          onChange={value => {
            onChangeFilter && onChangeFilter(value)
            setFilterValue(value)
          }}
        />
      </div>
    </div>
  )
}

export default SonarFeedActions
