import React from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import ContextMenu from '@santiment-network/ui/ContextMenu'
import Toggle from '@santiment-network/ui/Toggle'
import Button from '@santiment-network/ui/Button'
import Icon from '@santiment-network/ui/Icon'
import Panel from '@santiment-network/ui/Panel/Panel'
import ChartDownloadBtn from './ChartDownloadBtn'
import DownloadCSVBtn from './DownloadCSVBtn'
import ShareModalTrigger from '../../components/Share/ShareModalTrigger'
import styles from './ChartPage.module.scss'

const ShareChart = ({ trigger, shareLink }) => (
  <ShareModalTrigger
    trigger={trigger}
    classes={styles}
    shareLink={shareLink}
    extraShare={[
      {
        value: `<iframe frameborder="0" height="340" src="${shareLink}"></iframe>`,
        label: 'Copy iframe'
      }
    ]}
  />
)

const ChartSettingsContextMenu = ({
  chartRef,
  showNightModeToggle = true,
  isNightModeActive,
  onNightModeSelect,
  shareLink,
  activeMetrics,
  title,
  showDownload = true,
  showMulti = true,
  classes = {},
  scale,
  onScaleChange,
  isMultiChartsActive,
  onMultiChartsChange,
  children,
  chartData,
  events,
  eventsData
}) => {
  return (
    <ContextMenu
      trigger={
        <Button
          variant='flat'
          className={cx(classes.settingsBtn, styles.settingsBtn)}
        >
          <Icon type='settings' className={styles.settingsBtn} />
        </Button>
      }
      passOpenStateAs='isActive'
      position='bottom'
      align='end'
    >
      <Panel variant='modal' className={styles.context}>
        {onScaleChange && (
          <Button
            fluid
            variant='ghost'
            onClick={onScaleChange}
            className={styles.context__btn}
          >
            Log scale
            <Toggle
              isActive={scale === 'log'}
              className={styles.context__toggle}
            />
          </Button>
        )}
        {showNightModeToggle && (
          <Button
            fluid
            variant='ghost'
            onClick={onNightModeSelect}
            className={styles.context__btn}
          >
            Night Mode
            <Toggle
              isActive={isNightModeActive}
              className={styles.context__toggle}
            />
          </Button>
        )}
        {showMulti && (
          <Button
            fluid
            variant='ghost'
            className={styles.context__btn}
            onClick={onMultiChartsChange}
          >
            Multi charts
            <Toggle
              isActive={isMultiChartsActive}
              className={styles.context__toggle}
            />
          </Button>
        )}
        <ShareChart
          shareLink={shareLink}
          trigger={props => (
            <Button fluid variant='ghost' {...props}>
              <Icon type='share' className={styles.icon} />
              Share chart
            </Button>
          )}
        />
        {showDownload && (
          <>
            <DownloadCSVBtn
              fluid
              variant='ghost'
              title={title}
              chartData={chartData}
              events={events}
              eventsData={eventsData}
              metrics={activeMetrics}
            >
              <Icon type='save' className={styles.icon} />
              Download as CSV
            </DownloadCSVBtn>
            <ChartDownloadBtn
              fluid
              variant='ghost'
              metrics={activeMetrics}
              title={title}
              chartRef={chartRef}
            >
              <Icon type='save' className={styles.icon} />
              Download as PNG
            </ChartDownloadBtn>
          </>
        )}
        {children}
      </Panel>
    </ContextMenu>
  )
}

const mapStateToProps = ({ rootUi: { isWideChartEnabled } }) => ({
  isWideChart: isWideChartEnabled
})

export default connect(mapStateToProps)(ChartSettingsContextMenu)
