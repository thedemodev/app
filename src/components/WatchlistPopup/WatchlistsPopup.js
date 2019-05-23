import React, { useState } from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { Button, Dialog } from '@santiment-network/ui'
import { WatchlistGQL } from './WatchlistGQL'
import {
  USER_ADD_ASSET_TO_LIST,
  USER_REMOVE_ASSET_FROM_LIST
} from './../../actions/types'
import WatchlistsAnon from './WatchlistsAnon'
import Watchlists from './Watchlists'
import styles from './WatchlistsPopup.module.scss'

const AddToListBtn = (
  <Button variant='fill' accent='positive' className={styles.btn}>
    Add to watchlists
  </Button>
)

export const hasAssetById = ({ id, listItems }) =>
  listItems.some(({ project }) => project.id === id)

const WatchlistPopup = ({
  isLoggedIn,
  trigger = AddToListBtn,
  applyChanges,
  lists = [],
  ...props
}) => {
  const [changes, setChanges] = useState([])

  const addChange = change => {
    const prevLength = changes.length
    const changesWithoutProjectAndList = changes.filter(
      ({ projectId, assetsListId }) =>
        projectId !== change.projectId || assetsListId !== change.assetsListId
    )
    const currLength = changesWithoutProjectAndList.length
    prevLength === currLength
      ? setChanges([...changes, change])
      : setChanges(changesWithoutProjectAndList)
  }

  const [isShown, setIsShown] = useState(false)
  const close = () => {
    setChanges([])
    setIsShown(false)
  }
  const open = () => setIsShown(true)

  const toggleAssetInList = ({ projectId, assetsListId, listItems, slug }) => {
    if (!projectId) return
    const isAssetInList = hasAssetById({
      listItems: lists.find(({ id }) => id === assetsListId).listItems,
      id: projectId
    })
    addChange({ projectId, assetsListId, listItems, slug, isAssetInList })
  }

  const add = () => {
    applyChanges(changes)
    close()
  }

  return (
    <Dialog
      title='Add to watchlist'
      trigger={trigger}
      onOpen={open}
      onClose={close}
      open={isShown}
    >
      {isLoggedIn ? (
        <>
          <Dialog.ScrollContent withPadding>
            <Watchlists
              toggleAssetInList={toggleAssetInList}
              lists={lists}
              {...props}
            />
          </Dialog.ScrollContent>
          <Dialog.Actions className={styles.actions}>
            <Dialog.Cancel
              border={false}
              accent='grey'
              onClick={close}
              type='cancel'
            >
              Cancel
            </Dialog.Cancel>
            <Dialog.Approve
              disabled={changes.length === 0}
              type='submit'
              variant='flat'
              onClick={add}
            >
              Add
            </Dialog.Approve>
          </Dialog.Actions>
        </>
      ) : (
        <WatchlistsAnon />
      )}
    </Dialog>
  )
}

const sortWatchlists = (
  { insertedAt: insertedList1 },
  { insertedAt: insertedList2 }
) => new Date(insertedList1) - new Date(insertedList2)

const mapStateToProps = ({ watchlistUi }) => ({ watchlistUi })

const mapDispatchToProps = dispatch => ({
  applyChanges: changes => {
    changes.map(({ projectId, assetsListId, listItems, slug, isAssetInList }) =>
      dispatch({
        type: isAssetInList
          ? USER_REMOVE_ASSET_FROM_LIST
          : USER_ADD_ASSET_TO_LIST,
        payload: { projectId, assetsListId, listItems, slug }
      })
    )
  }
})

export default compose(
  graphql(WatchlistGQL, {
    name: 'Watchlists',
    skip: ({ isLoggedIn }) => !isLoggedIn,
    options: () => ({ context: { isRetriable: true } }),
    props: ({ Watchlists: { fetchUserLists = [], loading = true } }) => ({
      lists: fetchUserLists.sort(sortWatchlists),
      isLoading: loading
    })
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(WatchlistPopup)
