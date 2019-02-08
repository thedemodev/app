import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

let rulersNode = document.querySelector('#mt-rulers')

if (!rulersNode) {
  rulersNode = document.createElement('div')
  rulersNode.id = 'mt-rulers'
  rulersNode.style.height = 0
  rulersNode.style.maxWidth = '100%'
  rulersNode.style.overflow = 'hidden'
  rulersNode.style.visibility = 'hidden'
  document.body.appendChild(rulersNode)
}

const textRulers = new Map()

const getTextRuler = id => {
  if (textRulers.has(id)) return textRulers.get(id)

  const ruler = document.createElement('div')
  ruler.dataset.mtRulerId = id
  rulersNode.appendChild(ruler)
  ruler.textContent = '.'

  const res = {
    node: ruler,
    lineHeight: ruler.offsetHeight
  }

  textRulers.set(id, res)

  return res
}

class MultilineText extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    maxLines: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired
  }

  ruler = getTextRuler(this.props.id)

  textRef = React.createRef()

  componentDidMount () {
    const container = this.textRef.current.parentNode
    this.container = container

    this.updateRulerStyles()

    if (container.offsetHeight / this.ruler.lineHeight > this.props.maxLines) {
      this.forceUpdate()
    }
  }

  updateRulerStyles () {
    const containerStyles = window.getComputedStyle(this.container)
    const rulerStyles = this.ruler.node.style

    this.container.style.wordBreak = 'break-word'
    rulerStyles.wordBreak = 'break-word'

    rulerStyles.fontSize = containerStyles.fontSize
    rulerStyles.fontFamily = containerStyles.fontFamily
    rulerStyles.lineHeight = containerStyles.lineHeight
    rulerStyles.width = containerStyles.width
  }

  getTextDimensions (text) {
    this.ruler.node.textContent = text
    return {
      width: this.ruler.node.offsetWidth,
      height: this.ruler.node.offsetHeight
    }
  }

  getWordWidth (word) {
    this.ruler.node.textContent = word
    return this.ruler.node.offsetWidth
  }

  getTruncatedText () {
    const { text, maxLines } = this.props

    if (!this.container) {
      return text
    }

    const words = text.split(' ')
    const oneLineHeight = this.ruler.lineHeight

    let finalText

    for (let i = words.length; i > -1; i--) {
      finalText = words.slice(0, i).join(' ')
      if (
        this.getTextDimensions(finalText).height / oneLineHeight <=
        maxLines
      ) {
        break
      }
    }

    return finalText ? finalText.slice(0, -3) + '...' : text
  }

  render () {
    return (
      <Fragment>
        {this.getTruncatedText()}
        <span ref={this.textRef} style={{ display: 'none' }} />
      </Fragment>
    )
  }
}

export default MultilineText
