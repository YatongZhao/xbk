import React, { Component } from 'react'
import Image from '../../common/Image.js'
import s from './News.css'
import axios from '../../../api/axios.js'
import url from '../../../api/url.js'
import { connect } from 'react-redux'
import actions from '../../../actions'

class CardContainer extends Component {
  render () {
    return (
      <div className={s.cardContainer + ' ' + this.props.className}>
        {this.props.children}
      </div>
    )
  }
}

export class Images extends Component {
  render () {
    let { className, style, size=1.8 } = this.props
    return (
      <div
        className={
          className
            ? s.newsPicContainer + ' ' + className
            : s.newsPicContainer
        }
        style={style}
      >
        {this.props.images.map((item, index) => (
          <Image className={s.newsPic} key={index} src={item} style={{width: `${size}rem`, height: `${size}rem`}}></Image>
        ))}
      </div>
    )
  }
}

class Card extends Component {
  render () {
    let { name, content, createTime, source, imgs } = this.props
    let time = new Date(createTime.replace(/-/g, '/'))
    let year = time.getFullYear()
    let month = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1
    let day = time.getDay() < 10 ? '0' + time.getDay() : time.getDay()
    let hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
    let minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
    let images = imgs.split(';').filter(item => item!=='')

    return (
      <CardContainer className={s.card}>
        <div className={s.newsTitle}>{name} 发{source==='weibo' ? '微博' : 'ins'}了</div>
        <div className={s.newsSpan}>
          <span>{year}-{month}-{day} </span>
          <span> {hour}:{minutes}</span>
        </div>
        <div className={s.newsContent}>{content}</div>
        <Images images={images}></Images>
        {/* <div className={s.newsPicContainer}>
          {images.map((item, index) => (
            <Image className={s.newsPic} key={index} src={item}></Image>
          ))}
        </div> */}
      </CardContainer>
    )
  }
}

class News extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sorption: false,
      agenda_time: '',
      agenda_content: '',
      newsList: []
    }

    this.componentWillMount = this.componentWillMount.bind(this)
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    this.updateProps = this.updateProps.bind(this)
  }

  async componentWillMount () {
    await this.updateProps(this.props)
  }
  async componentWillReceiveProps (nextProps) {

    // redux的变化和router的变化都会触发此处的钩子函数，需要节流控制
    // if (nextProps.match.url === this.props.match.url) return
    await this.updateProps(nextProps)
  }
  // shouldComponentUpdate (nextProps, nextState) {
  //   return nextProps.match.url !== this.props.match.url
  // }
  async updateProps (props) {
    // let { activeStarId } = props
    let { match } = props
    let activeStarId = match.params.star_id
    let { code, data } = await axios({
      method: 'get',
      url: url.starStates(activeStarId)
    })
    if (code !== 0) return
    if (data.state === '数据库错误') return
    let time = new Date(data.data.agenda.detail_time)
    let timeStr = `${time.getMonth() + 1}月${time.getDate()}日 ${time.getHours() + 8 < 10 ? '0' + (time.getHours() + 8) : time.getHours() + 8}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()}`
    this.setState({
      agenda_time: timeStr,
      agenda_content: data.data.agenda.content,
      newsList: data.data.states
    })
  }
  render () {
    return (
      <div className={s.news}>
        <CardContainer className={s.scheduleContainer}>
          <div className={s.schedule}>下个行程：{this.state.agenda_time}</div>
          <div className={s.destination}>{this.state.agenda_content}</div>
        </CardContainer>
        {this.state.newsList.map(item => (
          <Card
            name={item.account_name}
            content={item.content}
            createTime={item.create_time}
            source={item.source}
            imgs={item.imgs}
            key={item.state_id}></Card>
        ))}
      </div>
    )
  }
}

// function newsMapStateToProps ({ activeStar }, ownProps) {
//   return ownProps
//   // return {
//   //   ...ownProps,
//   //   activeStarId: activeStar.star_id
//   // }
// }
// const News = connect(newsMapStateToProps, actions.activeStar)(NewsCore)

export default News
