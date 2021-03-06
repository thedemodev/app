export const getBalance = state => {
  return state.user.data.sanBalance > 0 ? state.user.data.sanBalance : 0
}

export const checkHasPremium = state => {
  return state.user.data.sanBalance >= 1000
}

export const checkIsLoggedIn = state => {
  return state.user.data && !!state.user.data.id
}

export const checkIsLoggedInPending = state => {
  return state.user.isLoading
}

export const isTelegramConnected = state => {
  if (!state.user.data) {
    return false
  }
  if (!state.user.data.settings) {
    return false
  }
  return state.user.data.settings.hasTelegramConnected
}

export const isTelegramConnectedAndEnabled = state => {
  if (!state.user.data) {
    return false
  }
  if (!state.user.data.settings) {
    return false
  }
  return (
    isTelegramConnected(state) && state.user.data.settings.signalNotifyTelegram
  )
}

export const selectIsEmailConnected = state => {
  if (!state.user.data) {
    return false
  }
  if (!state.user.data.settings) {
    return false
  }
  return state.user.data.email && state.user.data.settings.signalNotifyEmail
}

export const getUserWallet = state => {
  const { ethAccounts = {} } = state.user.data
  const doesUserHaveEthAccounts = ethAccounts && ethAccounts.length > 0
  const address = doesUserHaveEthAccounts ? ethAccounts[0].address : ''
  return address
}
