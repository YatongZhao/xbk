import React, { Component } from 'react';
import s from './TieDetail.css';
import axios from '../../../../api/axios.js'
import url from '../../../../api/url.js'
import Cookies from 'js-cookie'
import { Images } from '../../News/index'
import { starFetcher } from '../../../../api/fetcher.js';
import store from '../../../../store'
import { SET_TOAST_MESSAGE } from '../../../../actions/toast'


class Detail extends Component{
  constructor(props){
    super(props);
    this.state = {
      user_name: '',
      title: '',
      content: '',
      like_num: 0,
      imgs: '',
      is_like: false,
      star_name: 'star'
    };

    this.addUpNum = this.addUpNum.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
  }

  async addUpNum () {
    let { match } = this.props
    let user_id = Cookies.get('user_id')
    let { code, data } = await axios({
      method: 'put',
      url: url.postLike(match.params.post_id),
      data: {
        user_id
      }
    })
    if (code !== 0) {
      return store.dispatch({
        type: SET_TOAST_MESSAGE,
        message: '网络错误，请稍后重试！'
      })
    }
    if (data.state === 'success') {
      this.setState({
        like_num: this.state.like_num + 1,
        is_like: true
      })
      store.dispatch({
        type: SET_TOAST_MESSAGE,
        message: '点赞成功！'
      })
    } else {
      return store.dispatch({
        type: SET_TOAST_MESSAGE,
        message: '点赞失败，请稍后重试！'
      })
    }
  }

  handleBack () {
    let { history } = this.props
    if (history.length === 1) {
      history.replace('/')
    } else {
      history.goBack()
    }
  }

  async componentWillMount () {
    let user_id = Cookies.get('user_id')
    let { match } = this.props
    let { params } = match
    let { star_id } = params
    let { code: code1, data: data1 } = await starFetcher()
    if (code1 !== 0) return
    let activeStar = data1.find(item => Number(item.star_id) === Number(star_id))
    let { code, data } = await axios({
      method: 'get',
      url: url.postUser(match.params.post_id, user_id)
    })
    if (code !== 0) return
    this.setState({
      user_name: data.data.post_detail.user_name,
      title: data.data.post_detail.post.title,
      content: data.data.post_detail.post.content,
      like_num: data.data.post_detail.post.like_num,
      imgs: data.data.post_detail.post.imgs,
      is_like: data.data.post_detail.is_like,
      star_name: activeStar && activeStar.star_name
    })
  }

  render(){
    let { imgs } = this.state
    let images = imgs === ''
      ? []
      : imgs.split(';').map(item => `${window.app.api_domain}/api/image/${item}`)
    return (
      <div className={s.detail}>
        <div onClick={this.handleBack} className={s.leave}>
          返回
        </div>
        <p className={s["detail_title"]}>{this.state.title}</p>
        <div className={s["user_info"]}>
          <img src={require('../../../../static/image/avatar.png')} className={s.userhead} />
          <span className={s["detail_username"]}>{
            this.state.user_name===""
              ? <span><span className={s.starName}>{this.state.star_name}</span> 的小宝贝</span>
              : this.state.user_name
          }</span>
          
        </div>
        <p className={s["detail_content"]}>{this.state.content}</p>
        <Images images={images} style={{margin: '.2rem .2rem 0'}} size={2.26}></Images>
        <div className={s["detail_footer"]}>
          
          <img src={this.state.is_like ? require('../../../../static/image/bang_red.png') : require('../../../../static/image/bang.png')} alt="" className={s["up"]} onClick={this.addUpNum} />
          <span>{this.state.like_num}</span>
        </div>
      </div>
    );
  }
}

export default Detail;