import React, { Component } from 'react'
import c from './Home.css'
import NewsItemStyle from './NewsItem.css'
import Cookies from 'js-cookie'
import axios from '../../api/axios.js'
import url from '../../api/url.js'
import { Avatar, LazyImg, refreshImg } from '../common/Common.js'
import { connect } from 'react-redux'
import actions from '../../actions'

import { initActiveStar } from '../../api/fetcher'

class StarTag extends Component {
  render() {
    return (
      <div onClick={this.props.onClick} className={c.star}>
        <Avatar size={100} src={this.props.src}></Avatar>
        <div className={c.starName}>{this.props.name}</div>
      </div>
    )
  }
}

class NewsItem extends Component {
  render() {
    let { title, source, create_time = Date.now() - 60000, img, href } = this.props
    let timeDiff = Number(Date.now()) - Number(new Date(create_time.replace(/-/g, '/')))
    let timeStr = timeDiff < 1000 * 60
      ? `${Math.floor(timeDiff / 1000)}秒前`
      : timeDiff < 1000 * 60 * 60
        ? `${Math.floor(timeDiff / 1000 / 60)}分钟前`
        : timeDiff < 1000 * 60 * 60 * 36
          ? `${Math.floor(timeDiff / 1000 / 60 / 60)}小时前`
          : `${Math.floor(timeDiff / 1000 / 60 / 60 / 24)}天前`
    return (
      <a className={NewsItemStyle.newsItem} href={href}>
        <div className={NewsItemStyle.left}>
          <div className={NewsItemStyle.title}>{title}</div>
          <div className={NewsItemStyle.span}>{source} {timeStr}</div>
        </div>
        {/* <div
          className={NewsItemStyle.right}
          style={{backgroundImage: `url(${img})`}}>
        </div> */}
        <LazyImg className={NewsItemStyle.right} src={img}></LazyImg>
      </a>
    )
  }
}

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newsList: []
    }

    this.componentWillMount = this.componentWillMount.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.handleMoreStar = this.handleMoreStar.bind(this)
    this.handleActiveStar = this.handleActiveStar.bind(this)
    this.fetchNewsList = this.fetchNewsList.bind(this)
    this.fetchHotNews = this.fetchHotNews.bind(this)
  }

  handleMoreStar () {
    let { history } = this.props
    history.push('/add_follow')
  }

  async handleActiveStar (obj) {
    let { setActiveStar } = this.props
    setActiveStar(obj)
    await this.fetchNewsList(obj.star_id)
  }

  async fetchNewsList (star_id) {
    let { code, data } = await axios({
      method: 'get',
      url: url.starNews(star_id)
    })
    if (code !== 0) return
    this.setState({
      newsList: data.data
    })
  }

  async fetchHotNews () {
    let user_id = Cookies.get('user_id')
    let { code, data } = await axios({
      method: 'get',
      url: url.userNews(user_id)
    })
    if (code !== 0) return
    this.setState({
      newsList: data.data
    })
  }

  async componentWillMount () {
    let { star_id } = await initActiveStar()
    this.fetchNewsList(star_id)
  }

  componentDidMount () {
    // refreshImg()
  }

  render() {
    return (
      <div className={c.home}>
        <div className={c.homeStarContainer}>
          <StarTag name={'推荐'} src={require('../../static/image/hot.jpg')} onClick={this.fetchHotNews}></StarTag>
          {this.props.followList.map(item => (
            <StarTag
              onClick={this.handleActiveStar.bind(this, item)}
              name={item.star_name}
              key={item.star_id}
              src={`${window.app.api_domain}/api/image/${item.img}`}></StarTag>
          ))}
          <StarTag name={'更多'} src={require('../../static/image/more.jpg')} onClick={this.handleMoreStar}></StarTag>
        </div>
        <div className={c.homeNewsContainer}>
        {this.state.newsList.map(item => (
          <NewsItem
            title={item.title}
            create_time={item.create_time}
            source={item.source}
            img={item.img}
            href={item.news_url}
            key={item.news_id}></NewsItem>
        ))}
        </div>
      </div>
    )    
  }
}

function homeMapStateToProps ({ activeStar, follow }, ownProps) {
  return {
    ...ownProps,
    activeStarId: activeStar.star_id,
    followList: follow.followList
  }
}
const ConnectHome = connect(
  homeMapStateToProps,
  {
    ...actions.activeStar,
    ...actions.follow
  }
)(Home)

export default ConnectHome
