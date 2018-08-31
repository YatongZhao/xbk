import React, { Component } from 'react'
import s from './User.css'
import axios from '../../api/axios.js'
import url from '../../api/url.js'
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'
import { Avatar } from '../common/Common.js'
import f from '../../static/css/iconfont.css'

class User extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      isAnonymous: false
    }

    this.componentWillMount = this.componentWillMount.bind(this)
  }

  async componentWillMount () {
    let user_id = Cookies.get('user_id')
    let { code, data } = await axios({
      method: 'get',
      url: url.userInfo(user_id)
    })
    if (code !== 0) return
    if (data.state === 'success') {
      if (data.data.user_name === '') {
        this.setState({
          username: '匿名用户',
          isAnonymous: true
        })
      } else {
        this.setState({
          username: data.data.user_name,
          isAnonymous: false
        })
      }
    }
  }
  render() {
    return (
      <div className={s.user}>
        <div className={s.info}>
          <Avatar className={s.avatar} size={180} src={require('../../static/image/avatar.png')}></Avatar>
          <div className={s.name}>
            {this.state.username}
            {this.state.isAnonymous
              && <Link to="/login" className={s.loginBtn}>去登录<i className={`${f['icon-xiangqing']} ${f.iconfont} ${s.iconNameIcon}`}></i></Link>
            }
          </div>
        </div>
        <Link className={s.stars} to="/add_follow">
          <div className={s.starsTitle}>我的偶像</div>
          <i className={`${f['icon-xiangqing']} ${f.iconfont} ${s.iconNameIcon}`}></i>
        </Link>
      </div>
    )    
  }
}

export default User;