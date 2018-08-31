export const SET_FOLLOW_SUM = 'SET_FOLLOW_SUM'
export const SET_FOLLOW_LIST = 'SET_FOLLOW_LIST'

export const setFollowSum = (sum) => ({
  type: SET_FOLLOW_SUM,
  sum
})

export const setFollowList = (list) => ({
  type: SET_FOLLOW_LIST,
  list
})
