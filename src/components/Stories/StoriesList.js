import React, { useState } from 'react'
import cx from 'classnames'
import Dialog from '@santiment-network/ui/Dialog'
import StoryPreview from './StoryPreview'
import GA from './../../utils/tracking'
import Story from './Story'
import { stories } from './content'
import styles from './StoriesList.module.scss'

const StoriesList = ({ classes = {} }) => {
  const [selected, setSelected] = useState()

  return (
    <section className={cx(styles.list, classes.stories)}>
      <div className={styles.scrollableWrapper}>
        <div className={cx(styles.scrollable, classes.storiesScrollable)}>
          {stories.map(story => (
            <StoryPreview
              className={cx(styles.item, classes.story)}
              key={story.previewTitle}
              onClick={() => {
                GA.event({
                  category: 'Stories',
                  action: `Opened "${story.previewTitle}" story `
                })
                setSelected(story)
              }}
              {...story}
            />
          ))}
        </div>
      </div>
      <Dialog
        title={(selected || {}).storyHeaderName || ''}
        open={!!selected}
        onClose={setSelected}
        classes={styles}
      >
        <Dialog.ScrollContent className={styles.content}>
          <Story story={selected} onEnd={setSelected} />
        </Dialog.ScrollContent>
      </Dialog>
    </section>
  )
}

export default StoriesList
