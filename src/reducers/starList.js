import { SET_STAR_LIST } from '../actions/starList.js'

const initialState = []

const starListReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_STAR_LIST:
      return action.list
    default:
      return state
  }
}

export default starListReducer
