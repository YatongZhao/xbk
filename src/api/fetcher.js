import axios from './axios'
import url from './url'
import store from '../store'
import Cookies from 'js-cookie'
import createUV from './createUV'
import { SET_FOLLOW_LIST } from '../actions/follow';
import { SET_STAR_LIST } from '../actions/starList';
import { SET_ACTIVE_STAR } from '../actions/activeStar';

let state = {}
store.subscribe(() => {
  state = store.getState()
})

export async function userIdFetcher () {
  let suv = Cookies.get('suv')
  let user_id = Cookies.get('user_id')

  if (suv && user_id) return { user_id, suv }
  suv = createUV()

  let { code, data } = await axios({
    method: 'post',
    url: url.login,
    data: { suv }
  })

  if (code === 0 && data.data) {
    Cookies.set('user_id', data.data.user_id)
    Cookies.set('suv', suv)

    return { user_id: data.data.user_id, suv }
  } else {
    Cookies.set('user_id', 0)

    return { user_id: 0 }
  }
}

export async function starFetcher () {

  if (
    state && state.starList &&
    state.starList.length > 0

  ) return { code: 0, data: state.starList }
  let user_id = Cookies.get('user_id')
  let { code, data } = await axios({ method: 'get', url: url.star(user_id) })

  if (code === -1) return { code: -1 }

  if (data && data.state === 'success') {
    await store.dispatch({
      type: SET_STAR_LIST,
      list: data.data
    })
    let followList = data.data.filter(item => item.is_following)
    await store.dispatch({
      type: SET_FOLLOW_LIST,
      list: followList
    })

    return { code: 0, data: data.data }
  } else {

    return { code: -2 }
  }
}

export function setStarList (starList) {
  store.dispatch({
    type: SET_STAR_LIST,
    list: starList
  })
  let followList = starList.filter(item => item.is_following)
  store.dispatch({
    type: SET_FOLLOW_LIST,
    list: followList
  })
  let activeStar = starList.find(item => item.star_id === state.activeStar.star_id)
  if (activeStar) {
    store.dispatch({
      type: SET_ACTIVE_STAR,
      activeStar
    })
  }
}

export async function userFollowing () {
  let user_id = Cookies.get('user_id')
  let { code, data } = await axios({ method: 'get', url: url.userFollowing(user_id) })

  if (code === -1) return { code: -1 }

  if (data.state === 'success') {
    
  }
}

export async function initActiveStar () {
  if (
    state.activeStar && state.activeStar.star_id !== -1 && state.activeStar.is_following

  ) return state.activeStar

  let activeStar = {}

  if (!(state.starList && state.starList.length > 0)) {
    await starFetcher()
  }

  if (state.follow && state.follow.followList.length > 0) {
    activeStar = state.follow.followList[0]
  } else if (state.starList && state.starList.length > 0) {
    activeStar = state.starList[0]
  }
  store.dispatch({
    type: SET_ACTIVE_STAR,
    activeStar
  })

  return activeStar
}