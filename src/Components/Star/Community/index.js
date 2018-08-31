import React, { Component } from 'react'
import s from './Community.css'
import axios from '../../../api/axios.js'
import url from '../../../api/url.js'
import Cookies from 'js-cookie'
import { Images } from '../News/index'
import { formatTime } from '../../../utils'
import { Link } from 'react-router-dom'

class NewsItem extends Component {
  constructor(props){
    super(props)
  }

  render () {
    let { title, create_time, comment_num, imgs, star_id, post_id, user_name } = this.props
    let format_create_time = create_time.split(/\+/)[0].replace('T', ' ')
    let images = imgs === ''
      ? []
      : imgs.split(';').map(item => `${window.app.api_domain}/api/image/${item}`)
    return (
      <Link to={`/star/${star_id}/community/detail/${post_id}`} className={s.post} >
        <p className={s["post_title"]}>{title}</p>
        <Images images={images} style={{marginBottom: '.1rem'}} size={2.1}></Images>
        <div className={s["post_footer"]}>
          <div className={s["post_info"]}>
            <span className={s["post_time"]}>{formatTime(format_create_time)}</span>
            <span>{user_name}</span>
          </div>
          {/* <div className={s["post_commentsNum"]}><span>评论 {comment_num}</span></div> */}
        </div>
      </Link>
    )
  }
}

class Community extends Component {
  constructor(props){
    super(props)
    this.state = {
      postList: []
    }

    this.componentWillMount = this.componentWillMount.bind(this)
    this.handlePost = this.handlePost.bind(this)
  }

  handlePost () {
    let { history, match } = this.props
    history.push(`/star/${match.params.star_id}/community/create`)
  }
  async componentWillMount () {
    let { match } = this.props
    let user_id = Cookies.get('user_id')
    let { code, data } = await axios({
      method: 'get',
      url: url.starPosts(match.params.star_id, user_id)
    })
    if (code !== 0) return
    if (data.state === 'success') {
      this.setState({
        postList: data.data
      })
    }
  }

  render () {
    return (
      <React.Fragment>
        <div className={s.community}>
        {this.state.postList.map(item => (
          <NewsItem
            title={item.post.title}
            comment_num={item.post.comment_num}
            create_time={item.post.create_time}
            content={item.post.content}
            imgs={item.post.imgs}
            post_id={item.post.post_id}
            star_id={this.props.match.params.star_id}
            key={item.post.post_id}
            user_name={item.user_name}
          ></NewsItem>
        ))}
        </div>
        <div className={s.postBtn} onClick={this.handlePost}>发帖</div>
      </React.Fragment>
    )
  }
}

export default Community
