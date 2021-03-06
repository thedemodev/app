import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import ExplanationTooltip from '../../components/ExplanationTooltip/ExplanationTooltip'
import styles from './SidecarExplanationTooltip.module.scss'

const LS_SIDECAR_TOOLTIP_SHOWN = 'LS_SIDECAR_TOOLTIP_SHOWN'
const TOOLTIP_DELAY_IN_MS = 10000

const SidecarExplanationTooltip = props => {
  const {
    title = 'Explore assets',
    description = 'Quick navigation through your assets',
    localStorageSuffix = '',
    className,
    position = 'left',
    align = 'start'
  } = props

  const localStorageLabel = LS_SIDECAR_TOOLTIP_SHOWN + localStorageSuffix

  const wasShown = localStorage.getItem(localStorageLabel)

  const [shown, setShown] = useState()
  const [timer, setTimer] = useState()

  function hideTooltip () {
    localStorage.setItem(localStorageLabel, '+')
    setShown(false) // HACK(vanguard): To immediatly hide tooltip and then back to not controlled state
    setTimeout(() => setShown(undefined))
  }

  function disableHelp () {
    localStorage.setItem(localStorageLabel, '+')
    clearTimeout(timer)
  }

  useEffect(() => {
    if (!wasShown) {
      setTimer(setTimeout(() => setShown(true), TOOLTIP_DELAY_IN_MS))
    }

    return () => clearTimeout(timer)
  }, [])

  return (
    <ExplanationTooltip
      {...props}
      className={cx(styles.wrapper, className)}
      shown={shown}
      position={position}
      align={align}
      as='div'
      onOpen={shown ? undefined : disableHelp}
      text={
        <>
          {title}
          <div className={styles.text}>{description}</div>
          {shown && (
            <button className={styles.btn} onClick={hideTooltip}>
              Dismiss
            </button>
          )}
        </>
      }
    />
  )
}

export default SidecarExplanationTooltip
