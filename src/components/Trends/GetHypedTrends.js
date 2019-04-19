import React from 'react'
import { connect } from 'react-redux'
import { compose, pure } from 'recompose'
import * as actions from './actions.js'
import { simpleSort } from '../../utils/sortMethods'

export const SORT_TYPES = {
  hypeScore: 'score'
}

class GetHypedTrends extends React.Component {
  render () {
    const { render, items, ...rest } = this.props
    const trends = items.slice(-1)
    const props = {
      ...rest,
      items: trends.length > 0 ? [sortByHype(trends)] : trends
    }
    return render(props)
  }

  componentDidMount () {
    this.props.fetchHypedTrends()
  }
}

const sortByHype = items => {
  const sortedData = items[0].topWords.sort(sort(SORT_TYPES.hypeScore))
  return {
    ...items,
    topWords: sortedData
  }
}

const sort = sortBy => (a, b) => simpleSort(a[sortBy], b[sortBy])

const mapStateToProps = state => {
  return {
    ...state.hypedTrends
  }
}

const mapDispatchToProps = dispatch => ({
  fetchHypedTrends: () => {
    return dispatch({
      type: actions.TRENDS_HYPED_FETCH
    })
  }
})

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  pure
)

export default enhance(GetHypedTrends)
