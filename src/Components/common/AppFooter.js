import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Avatar } from './Common.js'
import s from './AppFooter.css'
import f from '../../static/css/iconfont.css'
import { connect } from 'react-redux'
import actions from '../../actions'
import { BackDrop } from './Common'
import { initActiveStar, starFetcher } from '../../api/fetcher.js';

class IconName extends Component {
  render () {
    return (
      <Link to={this.props.to} className={s.iconName + ' ' + this.props.className} style={{ position: 'relative', ...this.props.style}}>
        <i className={`${f[this.props.icon]} ${f.iconfont} ${s.iconNameIcon}`}
          style={{fontWeight: this.props.weight || 400, fontSize: `${this.props.size}rem` || undefined, marginBottom: `${this.props.bottom}rem` || 0}}></i>
        <span style={{position: 'relative'}}>{this.props.title}</span>
      </Link>
    )
  }
}

class AppFooterCore extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showStarList: false
    }

    this.handleJump = this.handleJump.bind(this)
    this.handleCloseStarList = this.handleCloseStarList.bind(this)
    this.handleCloseStarListOnly = this.handleCloseStarListOnly.bind(this)
    this.handleActiveStar = this.handleActiveStar.bind(this)
  }
  handleJump () {
    let { history, location, activeStarId } = this.props
    if (/^(\/star)/.test(location.pathname)) {
      if (!this.state.showStarList) {
        this.setState({
          showStarList: true
        })
        document.getElementById(s.footer).addEventListener('click', this.handleCloseStarListOnly)
      } else {
        this.handleCloseStarList()

      }
    } else {
      history.push(`/star/${activeStarId}/news`)
    }
  }
  handleActiveStar (activeStar) {
    let { history, setActiveStar } = this.props
    setActiveStar(activeStar)
    history.push(`/star/${activeStar.star_id}/news`)
  }
  handleCloseStarList () {
    this.setState({
      showStarList: false
    })
    document.getElementById(s.footer).removeEventListener('click', this.handleCloseStarListOnly)
  }
  handleCloseStarListOnly (e) {
    e.preventDefault()
    e.stopPropagation()
    this.handleCloseStarList()
  }

  async componentWillMount () {
    let { history, match, activeStarId, setActiveStar } = this.props
    let urlStarId = match.params.star_id

    if (urlStarId) {
      if (urlStarId !== activeStarId) {
        let { code, data } = await starFetcher()

        if (code !== 0) return
        let item = data.find(item => item.star_id === urlStarId)

        if (item) {
          setActiveStar(item)
        } else {
          let targetStarId

          if (activeStarId !== -1) {
            targetStarId = activeStarId
          } else {
            targetStarId = await initActiveStar()
          }
          history.replace(match.path.replace(':star_id', targetStarId))
        }
      }
    } else {
      await initActiveStar()
    }
  }

  render () {
    let { activeStarAvatar, followList } = this.props
    return (
      <React.Fragment>
        <BackDrop
          onClick={this.handleCloseStarList}
          z={15}
          show={this.state.showStarList ? 1 : 0}>
            <div className={s.starList}>
              {followList.map(item => (
                <Avatar
                  key={item.star_id}
                  onClick={this.handleActiveStar.bind(this, item)}
                  className={s.starListItem}
                  size={110}
                  src={`${window.app.api_domain}/api/image/${item.img}`}></Avatar>
              ))}
            </div>
        </BackDrop>
        <div className={s.footer} id={s.footer}>
          <IconName to="/" icon="icon-shouye" title="首页" className={s.footerSide}></IconName>
          <Avatar
            className={s.face} size={110}
            src={`${window.app.api_domain}/api/image/${activeStarAvatar}`}
            onClick={this.handleJump}></Avatar>
          <IconName to="/user" icon="icon-yonghu" title="我的" className={s.footerSide}></IconName>
        </div>
      </React.Fragment>
    )
  }
}

function appFooterMapStateToProps ({ activeStar, follow }, ownProps) {
  return {
    ...ownProps,
    activeStarAvatar: activeStar.img,
    activeStarId: activeStar.star_id,
    followList: follow.followList
  }
}
const ConnectAppFooter = connect(
  appFooterMapStateToProps,
  {
    ...actions.activeStar,
    ...actions.follow
  }
)(AppFooterCore)
const AppFooter = withRouter(ConnectAppFooter)

export {
  AppFooter,
  IconName
}

export default AppFooter
