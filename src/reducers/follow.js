import { SET_FOLLOW_SUM, SET_FOLLOW_LIST } from '../actions/follow.js'

const initialState = {
  sum: 0,
  followList: []
}

const imagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FOLLOW_SUM:
      let { followList } = state
      return {
        sum: action.sum,
        followList
      }
    case SET_FOLLOW_LIST:
      return {
        sum: action.list.length,
        followList: action.list
      }
    default:
      return state
  }
}

export default imagesReducer
