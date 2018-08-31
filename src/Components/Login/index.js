import React, { Component } from 'react'
import s from './Login.css'
import { Avatar } from '../common/Common.js'
import { Link } from 'react-router-dom'
import axios from '../../api/axios.js'
import url from '../../api/url.js'
import Cookies from 'js-cookie'

class Login extends Component {
  constructor (props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      tips: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick () {
    let { history } = this.props
    if (history.length === 1) {
      history.replace('/')
    } else {
      history.goBack()
    }
  }
  handleChange (type, event) {
    this.setState({
      ...this.state,
      [type]: event.target.value
    })
  }
  async handleSubmit (event) {
    event.preventDefault()
    let { code, data } = await axios({
      method: 'post',
      url: url.login,
      data: {
        user_name: this.state.username,
        password: this.state.password
      }
    })
    if (code !== 0) return
    if (data.state === 'success') {
      Cookies.set('user_id', data.data.user_id)
      let { history } = this.props
      history.push(`/user`)
    }
  }

  render () {
    return (
      <div className={s.login}>
        <div
          onClick={this.handleClick}
          style={{ backgroundImage: `url(${require('../../static/image/back.png')})` }}
          className={s.back}></div>
        <form onSubmit={this.handleSubmit} className={s.form}>
          <Avatar size={180} className={s.avatar} src={require('../../static/image/avatar.png')}></Avatar>
          <label className={s.iptBox}>
            <span className={s.iptSpan}>用户名：</span>
            <input type="text" className={s.ipt}
              value={this.state.username} onChange={this.handleChange.bind(this, 'username')}/>
          </label>
          <label className={s.iptBox}>
            <span className={s.iptSpan}>密码：</span>
            <input type="password" className={s.ipt}
              value={this.state.password} onChange={this.handleChange.bind(this, 'password')}/>
          </label>
          <span className={s.tips}>{this.state.tips}</span>
          <input className={s.submit} type="submit" value="登录"/>
          <Link to='/register' className={s.register}>注册</Link>
        </form>
      </div>
    )
  }
}

export default Login
