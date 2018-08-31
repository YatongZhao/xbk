// const domain = window.app.api_domain
const domain = ''

export default {
  register: `${domain}/api/user`,
  login: `${domain}/api/login`,
  userInfo: (user_id) => `${domain}/api/user/${user_id}`,
  userFollowing: (user_id) => `${domain}/api/user/${user_id}/following`,
  userUnFollowing: (user_id) => `${domain}/api/user/${user_id}/unfollowing`,
  star: (user_id) => `${domain}/api/star/user/${user_id}`,
  userInfo: (use_id) => `${domain}/api/user/${use_id}`,
  starNews: (star_id) => `${domain}/api/star/${star_id}/news`,
  userNews: (user_id) => `${domain}/api/user/${user_id}/news`,
  starStates: (star_id) => `${domain}/api/star/${star_id}/states`,
  starHead: (star_id) => `${domain}/api/star/${star_id}/head`,
  starPosts: (star_id, user_id) => `${domain}/api/star/${star_id}/posts/user/${user_id}`,
  post: `${domain}/api/post`,
  image: `${domain}/api/image`,
  postUser: (post_id, user_id) => `${domain}/api/post/${post_id}/user/${user_id}`,
  postLike: (post_id) => `${domain}/api/post/${post_id}/like`
}
