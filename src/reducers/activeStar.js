import { SET_ACTIVE_STAR } from '../actions/activeStar.js'

const initialState = {
  src: '',
  star_id: -1,
  star_name: '明星',
  img: '',
  is_following: false
}

const activeStarReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_STAR:
      // return {
      //   src: action.src,
      //   star_id: action.star_id
      // }
      return {...action.activeStar}
    default:
      return state
  }
}

export default activeStarReducer
