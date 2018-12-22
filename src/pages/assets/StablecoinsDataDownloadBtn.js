import React from 'react'
import { Button } from 'semantic-ui-react'
import styles from './StablecoinsDataDownloadBtn.module.scss'

const StablecoinsDataDownloadBtn = () => {
  return (
    <Button className={styles.button}>
      <a
        href='https://docs.google.com/spreadsheets/u/1/d/1OwF5xKsPRxFsy3WvSest-gn8lFbm7cTQLhW3ylZE_2M/export?format=xlsx'
        target='_blank'
        className={styles.link}
      />
      Download .xls
    </Button>
  )
}

export default StablecoinsDataDownloadBtn
