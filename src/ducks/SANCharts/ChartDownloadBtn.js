import React from 'react'
import Button from '@santiment-network/ui/Button'
import { setupColorGenerator } from './utils'
import { getDateFormats, getTimeFormats } from '../../utils/dates'
import { WaterMarkPath } from './ChartWatermark'
import colors from '@santiment-network/ui/variables.scss'

function setStyle (target, styles) {
  target.setAttribute('style', styles)
}

const HIDDEN_STYLES = `
position: absolute;
left: 200vw;`

const SVG_STYLES = `
    --porcelain: ${colors.porcelain};
    --mystic: ${colors.mystic};
    --malibu: ${colors.malibu};
    --heliotrope: ${colors.heliotrope};
    --persimmon: ${colors.persimmon};
    --white: white;
    --texas-rose: ${colors['texas-rose']};
    --jungle-green: ${colors['jungle-green']};
    --lima: ${colors.lima};
    --dodger-blue: ${colors['dodger-blue']};
    --waterloo: ${colors.waterloo};
    background: white;
  `

const TEXT_STYLES = `
fill: #9faac4;
font-family: Rubik, sans-serif;
font-weight: 400;
font-size: 12px;
line-height: 18px;
`

const AXIS_STYLES = `
stroke: var(--porcelain);
stroke-dasharray: 7;
`

const TICK_STYLES = 'display: none'

const LEGEND_RECT_SIZE = 5
const LEGEND_RECT_RIGHT_MARGIN = 5
const LEGEND_RECT_ALIGN_CORRECTION = LEGEND_RECT_SIZE / 5
const TEXT_RIGHT_MARGIN = 20
const TEXT_FONT = '12px Rubik'

function drawAndMeasureText (ctx, text, x, y) {
  ctx.fillText(text, x, y)
  return ctx.measureText(text).width
}

const addWatermark = svg => {
  const newElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  )
  newElement.setAttribute('d', WaterMarkPath)
  newElement.style.fill = '#D2D6E7'
  newElement.style.transform = 'translate(89%,2%)'

  svg.appendChild(newElement)

  return svg
}

function downloadChart ({ current: chart }, metrics, title) {
  const div = document.createElement('div')
  setStyle(div, HIDDEN_STYLES)

  const svg = addWatermark(
    chart.querySelector('.recharts-surface').cloneNode(true)
  )

  div.appendChild(svg)
  document.body.appendChild(div)
  setStyle(svg, SVG_STYLES)

  const texts = svg.querySelectorAll('text')
  texts.forEach(text => setStyle(text, TEXT_STYLES))

  const axes = svg.querySelectorAll('.recharts-cartesian-axis-line')
  axes.forEach(axis => setStyle(axis, AXIS_STYLES))

  const axisTicks = svg.querySelectorAll('.recharts-cartesian-axis-tick-line')
  axisTicks.forEach(tick => setStyle(tick, TICK_STYLES))

  const brush = svg.querySelector('.recharts-brush')
  brush.style.display = 'none'

  const canvas = document.createElement('canvas')
  div.appendChild(canvas)

  const svgSize = svg.getBoundingClientRect()
  canvas.width = svgSize.width * 2
  canvas.height = svgSize.height * 2
  canvas.style.width = svgSize.width
  canvas.style.height = svgSize.height

  const ctx = canvas.getContext('2d')
  ctx.scale(2, 2)

  const svgData = new XMLSerializer().serializeToString(svg)
  const img = document.createElement('img')

  img.onload = function () {
    const generateColor = setupColorGenerator()
    ctx.drawImage(img, 0, 0)

    ctx.font = TEXT_FONT

    const textWidth =
      metrics.reduce((acc, { label }) => {
        return (
          acc +
          LEGEND_RECT_SIZE +
          LEGEND_RECT_RIGHT_MARGIN +
          ctx.measureText(label).width
        )
      }, 0) +
      TEXT_RIGHT_MARGIN * (metrics.length - 1)

    const textY = svgSize.height - 20
    let textX = (svgSize.width - textWidth) / 2

    metrics.forEach(({ color, label }) => {
      ctx.fillStyle = colors[generateColor(color)]
      ctx.fillRect(
        textX,
        textY - LEGEND_RECT_SIZE - LEGEND_RECT_ALIGN_CORRECTION,
        LEGEND_RECT_SIZE,
        LEGEND_RECT_SIZE
      )
      ctx.fillStyle = colors.mirage
      textX += LEGEND_RECT_SIZE + LEGEND_RECT_RIGHT_MARGIN
      textX += drawAndMeasureText(ctx, label, textX, textY) + TEXT_RIGHT_MARGIN
    })

    const date = new Date()
    const { DD, MMM, YYYY } = getDateFormats(date)
    const { HH, mm, ss } = getTimeFormats(date)
    const a = document.createElement('a')
    a.download = `${title} [${HH}.${mm}.${ss}, ${DD} ${MMM}, ${YYYY}].png`
    a.href = canvas.toDataURL('image/png', 1)

    div.appendChild(a)
    a.click()

    div.remove()
  }

  img.setAttribute(
    'src',
    'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  )
}

const ChartDownloadBtn = ({ chartRef, metrics, title, ...props }) => {
  return (
    <Button
      {...props}
      onClick={() => {
        try {
          downloadChart(chartRef, metrics, title)
        } catch (e) {
          alert("Can't download this chart")
        }
      }}
    />
  )
}

export default ChartDownloadBtn
