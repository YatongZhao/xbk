import { combineReducers } from 'redux'
import imagesReducer from './images'
import followReducer from './follow'
import activeStarReducer from './activeStar'
import starListReducer from './starList'
import toastReducer from './toast'

const rootReducer = combineReducers({
  images: imagesReducer,
  follow: followReducer,
  activeStar: activeStarReducer,
  starList: starListReducer,
  toast: toastReducer
})

export default rootReducer
