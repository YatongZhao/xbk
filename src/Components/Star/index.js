import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import News from './News'
import Community from './Community'
import Billbord from './Billbord'
import s from './Star.css'
import { IconName } from '../common/AppFooter.js'
import { connect } from 'react-redux'
import actions from '../../actions'
import axios from '../../api/axios.js'
import url from '../../api/url.js'

class NavCore extends Component {
  render () {
    let path = window.location.pathname
    let { star_id } = this.props
    return (
      <div className={s.nav + ' ' + this.props.className} style={this.props.style}>
        <IconName to={`/star/${star_id}/news`} icon="icon-icon-xiaoxi" title="动态"
          className={/\/news/.test(path) ? s.active : ''}></IconName>
        <IconName to={`/star/${star_id}/community`} icon="icon-shequ-active" title="社区" size={.32} bottom={.01}
          className={/\/community/.test(path) ? s.active : ''}></IconName>
        {/* <IconName to={`/star/${star_id}/billbord`} icon="icon-paihangbang" title="打榜"></IconName> */}
      </div>
    )
  }
}

function navMapStateToProps ({ activeStar }, ownProps) {
  return {
    ...ownProps,
    activeStarId: activeStar.star_id
  }
}
const Nav = withRouter(connect(navMapStateToProps, actions.activeStar)(NavCore))

class SorptionNav extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sorption: false
    }

    this.handleScroll = this.handleScroll.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)
  }
  handleScroll () {
    let sorption = window.document.documentElement.scrollTop > this.props.top
    this.state.sorption !== sorption && this.setState({ sorption })
  }
  componentDidMount () {
    window.addEventListener('scroll', this.handleScroll)
  }
  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleScroll)
  }
  render () {
    return (
      <React.Fragment>
        <Nav
          star_id={this.props.star_id}
          className={s.sorptionNav}
          style={{opacity: this.state.sorption ? 1 : 0}}></Nav>
      </React.Fragment>
    )
  }
}

class Star extends Component {
  constructor (props) {
    super(props)
    this.state = {
      bannerHeight: 1000,
      banner: ''
    }

    this.handleLoad = this.handleLoad.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    this.updateProps = this.updateProps.bind(this)
  }
  handleLoad (e) {
    this.setState({
      bannerHeight: e.target.height
    })
  }
  async componentWillMount () {
    this.updateProps(this.props)
  }
  async componentWillReceiveProps (nextProps) {
    await this.updateProps(nextProps)
  }
  async updateProps (props) {
    let { match } = props
    let { code, data } = await axios({
      method: 'get',
      url: url.starHead(match.params.star_id)
    })
    if (code !== 0) return
    this.setState({
      banner: `${window.app.api_domain}/api/image/${data.data.banner}`
    })
  }
  render () {
    let div = document.createElement('div')
    let canUseSticky = false
    if (div.style.position !== undefined) {
      div.style.position = 'sticky'
      if (div.style.position === 'sticky') {
        canUseSticky = true
      } else {
        div.style.position = '-webkit-sticky'
        if (div.style.position === '-webkit-sticky') {
          canUseSticky = true
        }
      }
    }

    return (
      <div className={s.star}>
        {!canUseSticky && <SorptionNav star_id={this.props.match.params.star_id} top={this.state.bannerHeight}></SorptionNav>}
        <img className={s.banner} onLoad={this.handleLoad} src={this.state.banner} alt=""/>
        <Nav star_id={this.props.match.params.star_id} className={s.desc}></Nav>
        <div className={s.content}>
          <Switch>
            <Route exact path="/star/:star_id/news" component={News} />
            <Route path="/star/:star_id/community" component={Community} />
            <Route path="/star/:star_id/billbord" component={Billbord} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default Star
