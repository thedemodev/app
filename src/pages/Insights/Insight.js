import React, { Component } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Raven from 'raven-js'
import debounce from 'lodash.debounce'
import { compose, pure } from 'recompose'
import moment from 'moment'
import { Button, Icon } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import {
  createSkeletonProvider,
  createSkeletonElement
} from '@trainline/react-skeletor'
import { convertToRaw } from 'draft-js'
import { Editor, createEditorState } from 'medium-draft'
import mediumDraftImporter from 'medium-draft/lib/importer'
import 'medium-draft/lib/index.css'
import InsightsLayout from './InsightsLayout'
import Panel from './../../components/Panel'
import LikeBtn from './../InsightsNew/LikeBtn'
import { votePostGQL, unvotePostGQL } from './../InsightsPage'
import { getBalance } from './../UserSelectors'
import InsightImageModal from './InsightImageModal'
import { APP_UPDATE_INSIGHT_DRAFT } from '../../actions/types.js'
import './Insight.css'

const POLLING_INTERVAL = 100000

const H2 = createSkeletonElement('h2', 'pending-home')
const Span = createSkeletonElement('span', 'pending-home')
const Div = createSkeletonElement('div', 'pending-home')

const isPostADraftByDifferentUser = (post, user) =>
  post.readyState === 'draft' && post.user.id !== user.data.id

class Insight extends Component {
  constructor (props) {
    super(props)

    this.state = {
      content: createEditorState(),
      modalPicSrc: null
    }
  }

  componentWillReceiveProps (nextProps) {
    const text = (nextProps.Post.post || {}).text
    if (text) {
      this.setState({
        content: createEditorState(
          convertToRaw(mediumDraftImporter(text || ''))
        )
      })
    }
  }

  onInsightContentClick = ({ target }) => {
    if (target.tagName.toUpperCase() !== 'IMG') return
    this.setState(prevState => ({
      ...prevState,
      modalPicSrc: target.src
    }))
  }

  onInsightImageModalClose = () => {
    this.setState({
      ...this.state,
      modalPicSrc: null
    })
  }

  render () {
    const {
      history,
      Post = {
        loading: true,
        post: null
      },
      votePost,
      unvotePost,
      balance = 0,
      user = {
        data: {}
      },
      updateDraft
    } = this.props
    const {
      post = {
        id: null,
        title: '',
        text: '',
        createdAt: null,
        user: {
          username: null
        },
        readyState: 'draft',
        votedAt: null,
        votes: {}
      }
    } = Post
    const { content, modalPicSrc } = this.state
    if (!user.isLoading && !user.token) {
      return (
        <div className='insight'>
          <InsightsLayout isLogin={false} title={`SANbase...`}>
            <div className='insight-login-request'>
              <h2>
                You need to have SANbase account, if you want to see insights.
              </h2>
              <Button
                onClick={() =>
                  history.push(
                    `/login?redirect_to=${history.location.pathname}`
                  )
                }
                color='green'
              >
                <Icon name='checkmark' /> Login or Sign up
              </Button>
            </div>
          </InsightsLayout>
        </div>
      )
    }

    if (!post || isPostADraftByDifferentUser(post, user)) {
      return <Redirect to='/insights' />
    }

    return (
      <div className='insight'>
        <InsightImageModal
          pic={modalPicSrc}
          onInsightImageModalClose={this.onInsightImageModalClose}
        />
        <InsightsLayout
          isLogin={!!user}
          title={`SANbase: Insight - ${post.title}`}
        >
          <Panel className='insight-panel'>
            <div className='insight-panel-header'>
              <H2>{post.title}</H2>
              {post.readyState === 'draft' && (
                <Button
                  basic
                  onClick={() => {
                    updateDraft(post)
                    history.push(`/insights/update/${post.id}`, { post })
                  }}
                >
                  edit
                </Button>
              )}
            </div>
            <Span>
              by{' '}
              {post.user.username ? (
                <a href={`/insights/users/${post.user.id}`}>
                  {post.user.username}
                </a>
              ) : (
                'unknown author'
              )}
            </Span>
            &nbsp;&#8226;&nbsp;
            {post.createdAt && (
              <Span>{moment(post.createdAt).format('MMM DD, YYYY')}</Span>
            )}
            <Div
              className='insight-content'
              style={{ marginTop: '1em' }}
              onClick={this.onInsightContentClick}
            >
              <Editor
                editorEnabled={false}
                editorState={content}
                disableToolbar
                onChange={() => {}}
              />
            </Div>
            <div className='insight-panel-footer'>
              <LikeBtn
                onLike={() => {
                  if (post.votedAt) {
                    debounce((postId, unvote) => {
                      unvote({
                        variables: { postId: parseInt(postId, 10) }
                      })
                        .then(() => Post.refetch())
                        .catch(e => Raven.captureException(e))
                    }, 100)(post.id, unvotePost)
                  } else {
                    debounce((postId, vote) => {
                      vote({
                        variables: { postId: parseInt(postId, 10) }
                      })
                        .then(() => Post.refetch())
                        .catch(e => Raven.captureException(e))
                    }, 100)(post.id, votePost)
                  }
                }}
                balance={balance}
                liked={!!post.votedAt}
                votes={post.votes}
              />
            </div>
          </Panel>
        </InsightsLayout>
      </div>
    )
  }
}

export const postGQL = gql`
  query postGQL($id: ID!) {
    post(id: $id) {
      id
      title
      text
      shortDesc
      createdAt
      state
      readyState
      user {
        username
        id
      }
      votedAt
      votes {
        totalSanVotes
        totalVotes
      }
    }
  }
`

const mapStateToProps = state => {
  return {
    user: state.user,
    balance: getBalance(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateDraft: payload => {
      dispatch({
        type: APP_UPDATE_INSIGHT_DRAFT,
        payload
      })
    }
  }
}

const enhance = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  graphql(postGQL, {
    name: 'Post',
    options: ({ match }) => ({
      skip: !match.params.insightId,
      errorPolicy: 'all',
      pollInterval: POLLING_INTERVAL,
      variables: {
        id: +match.params.insightId
      }
    })
  }),
  graphql(votePostGQL, {
    name: 'votePost'
  }),
  graphql(unvotePostGQL, {
    name: 'unvotePost'
  }),
  pure
)

const withSkeleton = createSkeletonProvider(
  {
    Post: {
      loading: true,
      post: {
        title: '_____',
        link: 'https://sanbase.net',
        createdAt: new Date(),
        user: {
          username: ''
        }
      }
    }
  },
  ({ Post }) => Post.loading,
  () => ({
    backgroundColor: '#bdc3c7',
    color: '#bdc3c7'
  })
)(Insight)

export default enhance(withSkeleton)
