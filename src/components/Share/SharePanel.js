import React from 'react'
import PropTypes from 'prop-types'
import Button from '@santiment-network/ui/Button'
import Icon from '@santiment-network/ui/Icon'
import Input from '@santiment-network/ui/Input'
import Dialog from '@santiment-network/ui/Dialog'
import ShareComposition from './ShareComposition'
import ShareCopyBtn from './ShareCopyBtn.js'
import styles from './SharePanel.module.scss'

const SECRET_LINK_TAG = '__SECRET_LINK_TAG__'
const SECRET_TEXT_TAG = '__SECRET_TEXT_TAG__'
const SECRET_TITLE_TAG = '__SECRET_TITLE_TAG__'

const mediasToShare = [
  {
    label: 'Twitter',
    icon: 'twitter',
    href: `https://twitter.com/home?status=${SECRET_TEXT_TAG}%0Alink%3A%20${SECRET_LINK_TAG}`
  },
  {
    label: 'Facebook',
    icon: 'facebook',
    href: `https://www.facebook.com/sharer/sharer.php?u=${SECRET_LINK_TAG}`
  },
  {
    label: 'LinkedIn',
    icon: 'linked-in',
    href: `https://www.linkedin.com/shareArticle?mini=true&title=${SECRET_TITLE_TAG}&summary=${SECRET_TEXT_TAG}&source=santiment.net&url=${SECRET_LINK_TAG}`
  },
  {
    label: 'Telegram',
    icon: 'telegram',
    href: `https://telegram.me/share/url?text=${SECRET_TEXT_TAG}&url=${SECRET_LINK_TAG}`
  },
  {
    label: 'Reddit',
    icon: 'reddit',
    href: `https://reddit.com/submit?title=${SECRET_TEXT_TAG}&url=${SECRET_LINK_TAG}`
  }
]

const SharePanel = ({ shareTitle, shareText, shareLink, extraShare }) => {
  const encodedTitle = encodeURIComponent(shareTitle)
  const encodedText = encodeURIComponent(shareText)
  const encodedLink = encodeURIComponent(shareLink)

  return (
    <Dialog.ScrollContent className={styles.wrapper}>
      <div className={styles.composition}>
        <ShareComposition />
      </div>
      <div className={styles.content}>
        <div className={styles.link}>
          <Input
            className={styles.link__input}
            readOnly
            defaultValue={shareLink}
          />
          <ShareCopyBtn shareLink={shareLink} />
        </div>
        {extraShare.map(({ value, label }, idx) => (
          <div className={styles.link} key={idx}>
            <Input
              className={styles.link__input}
              readOnly
              defaultValue={value}
            />
            <ShareCopyBtn shareLink={value} label={label} />
          </div>
        ))}

        {mediasToShare.map(({ label, icon, href }) => {
          return (
            <Button
              key={label}
              variant='flat'
              as='a'
              className={styles.btn}
              target='_blank'
              rel='noopener noreferrer'
              href={href
                .replace(SECRET_LINK_TAG, encodedLink)
                .replace(SECRET_TEXT_TAG, encodedText)
                .replace(SECRET_TITLE_TAG, encodedTitle)}
            >
              <Icon type={icon} className={styles.icon} /> Share on {label}
            </Button>
          )
        })}
      </div>
    </Dialog.ScrollContent>
  )
}

SharePanel.propTypes = {
  shareLink: PropTypes.string.isRequired,
  shareTitle: PropTypes.string,
  shareText: PropTypes.string
}

SharePanel.defaultProps = {
  shareTitle: 'Sanbase',
  shareText: 'Hey! Look what I have found at the app.santiment.net!',
  extraShare: []
}

export default SharePanel
