export const SET_TOAST_MESSAGE = 'SET_TOAST_MESSAGE'
export const RESET_TOAST_STATE = 'RESET_TOAST_STATE'

export const setToastMessage = (message) => ({
  type: SET_TOAST_MESSAGE,
  message
})

export const resetToastState = () => ({
  type: RESET_TOAST_STATE
})
