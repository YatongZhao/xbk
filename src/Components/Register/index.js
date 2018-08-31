import React, { Component } from 'react'
import s from './Register.css'
import { Avatar } from '../common/Common.js'
import axios from '../../api/axios.js'
import url from '../../api/url.js'
import Cookies from 'js-cookie'
import createUV from '../../api/createUV'

class Register extends Component {
  constructor (props) {
    super(props)

    this.state = {
      username: '',
      password: ''
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
    let user_id = Cookies.get('user_id')
    let suv = Cookies.get('suv')
    let { code, data } = await axios({
      method: 'post',
      url: url.register,
      data: {
        user_name: this.state.username,
        password: this.state.password,
        suv: createUV()
        // user_id
      }
    })
    if (code !== 0) return
    if (data.state === 'success') {
      let { history } = this.props
      history.push(`/user`)
    }
  }

  render () {
    return (
      <div className={s.register}>
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
          <input className={s.submit} type="submit" value="注册"/>
        </form>
      </div>
    )
  }
}

export default Register
