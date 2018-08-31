import { ADD_IMAGE, REMOVE_IMAGE } from '../actions/images'

const initialState = {
  src: '',
  active: false
}

const imagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_IMAGE:
      return {
        src: action.src,
        active: true
      }
    case REMOVE_IMAGE:
      return initialState
    default:
      return state
  }
}

export default imagesReducer
