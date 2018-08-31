import React, { Component } from 'react'
import { Avatar } from '../common/Common.js'
import axios from '../../api/axios.js'
import url from '../../api/url.js'
import s from './AddFollow.css'
import Cookies from 'js-cookie'
import { connect } from 'react-redux'
import actions from '../../actions'
import store from '../../store'
import { SET_TOAST_MESSAGE } from '../../actions/toast'

import { userIdFetcher } from '../../api/fetcher.js'
import { starFetcher } from '../../api/fetcher.js'
import { setStarList } from '../../api/fetcher.js';

class FollowCard extends Component {
  constructor(props) {
    super(props)

    this.handleFollow = this.handleFollow.bind(this)
  }
  async handleFollow () {
    let { sum } = this.props
    let { starId, is_following } = this.props
    if (sum >= 3 && !is_following) {
      return store.dispatch({
        type: SET_TOAST_MESSAGE,
        message: '最多只能关注3位明星'
      })
    }
    let user_id = Cookies.get('user_id')
    let { code, data } = await axios({
      method: 'put',
      url: is_following ? url.userUnFollowing(user_id) : url.userFollowing(user_id),
      data: { star_id: starId }
    })
    if (code !== 0) {
      return store.dispatch({
        type: SET_TOAST_MESSAGE,
        message: '网络错误，请稍后重试！'
      })
    }
    if (data.state === 'success') {
      let { data: starList } = await starFetcher()
      setStarList(starList.map(item => {
        if (item.star_id === starId) {
          item.is_following = !is_following
        }
        return item
      }))
      store.dispatch({
        type: SET_TOAST_MESSAGE,
        message: is_following ? '取消关注成功！' : '关注成功！'
      })
    }
  }
  render () {
    return (
      <div className={s.followCard}>
        <div className={s.info}>
          <Avatar size={112} src={this.props.src}></Avatar>
          <div className={s.starName}>{this.props.starName}</div>
        </div>
        <div
          onClick={this.handleFollow}
          style={{
            backgroundColor: this.props.is_following ? '#FFEE90' : '#FFF9D9'
          }}
          className={s.btn}>
            {this.props.is_following ? '已关注' : '未关注'}
        </div>
      </div>
    )
  }
}

function followCardMapStateToProps ({ follow }, ownProps) {
  return {
    ...ownProps,
    sum: follow.sum
  }
}
const ConnectFollowCard = connect(followCardMapStateToProps, actions.follow)(FollowCard)

class AddFollow extends Component {
  constructor(props) {
    super(props)

    this.componentWillMount = this.componentWillMount.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.changeIsFollow = this.changeIsFollow.bind(this)
  }
  handleBack () {
    let { history } = this.props
    history.replace('/')
  }
  changeIsFollow (star_id, is_following) {
    let { starList, setStarList } = this.props
    let list = starList.map(item => {
      item.star_id === star_id
        && (item.is_following = is_following)
      return item
    })
    setStarList(list)
  }
  async componentWillMount () {
    await userIdFetcher()
    await starFetcher()
  }
  render () {
    return (
      <div>
        <header className={s.header}>
          <div
            onClick={this.handleBack}
            style={{ backgroundImage: `url(${require('../../static/image/back.png')})` }}
            className={s.back}></div>
          <div>添加关注</div>
          <div className={s.confirm} onClick={this.handleBack}>确定</div>
        </header>
        <div className={s.container}>
          {this.props.starList.map(item => (
            <ConnectFollowCard
              is_following={item.is_following}
              starId={item.star_id}
              starName={item.star_name}
              src={`${window.app.api_domain}/api/image/${item.img}`} key={item.star_id}></ConnectFollowCard>
          ))}
        </div>
      </div>
    )
  }
}

function addFollowMapStateToProps ({ starList }, ownProps) {
  return {
    ...ownProps,
    starList
  }
}
const ConnectAddFollow = connect(
  addFollowMapStateToProps,
  {
    ...actions.follow,
    ...actions.starList
  }
)(AddFollow)

export default ConnectAddFollow
