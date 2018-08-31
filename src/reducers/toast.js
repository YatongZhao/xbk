import { SET_TOAST_MESSAGE, RESET_TOAST_STATE } from '../actions/toast.js'

const initialState = {
  showToast: false,
  message: ''
}

const toastReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOAST_MESSAGE:
      return {
        message: action.message,
        showToast: true
      }
    case RESET_TOAST_STATE:
      return {
        showToast: false,
        message: state.message
      }
    default:
      return state
  }
}

export default toastReducer
