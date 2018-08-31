import React, { Component } from 'react'
import s from './Common.css'
import { connect } from 'react-redux'
import actions from '../../actions'

class BackDrop extends Component {
  constructor (props) {
    super(props)

    this.handleTouchMove = this.handleTouchMove.bind(this)
  }
  handleTouchMove (e) {
    e.preventDefault()
    e.stopPropagation()
    return false
  }
  render () {
    let { show } = this.props
    return (
      <div
        {...this.props}
        onTouchMove={this.handleTouchMove}
        className={
          this.props.className
            ? s.backDrop + ' ' + this.props.className
            : s.backDrop
          }
        style={{
          opacity: show ? 1 : 0,
          zIndex: show
            ? this.props.z || 1000
            : -1,
          ...this.props.style
        }}
      >
        {this.props.children}
      </div>
    )
  }
}

class Avatar extends Component {
  render () {
    return (
      <div
        onClick={this.props.onClick}
        style={{
          backgroundImage: `url(${this.props.src})`,
          width: `${Number(this.props.size) / 100}rem`,
          height: `${Number(this.props.size) / 100}rem`
        }}
        className={
          this.props.className
            ? s.avatar + ' ' + this.props.className
            : s.avatar
        }>
      </div>
    )
  }
}

class ToastCore extends Component {
  constructor (props) {
    super(props)
    this.timer = null

    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    let { toast, resetToastState } = nextProps
    let { showToast } = toast
    if (showToast) {
      clearTimeout(this.timer)
      this.timer = setTimeout(resetToastState, 1500)
    }
  }
  render () {
    let { showToast, message } = this.props.toast
    return (<React.Fragment>
      <div className={s.toast} style={{opacity: showToast ? 1 : 0, zIndex: showToast ? 10000 : -1000}}>{message}</div>
    </React.Fragment>)
  }
}
function toastMapStateToProps ({ toast } ,ownProps) {
  return {
    toast,
    ...ownProps
  }
}
const Toast = connect(toastMapStateToProps, { ...actions.toast })(ToastCore)

let imgArr = []
const calcImg = (img, num = 0, height = window.outerHeight, delay = 0) => {
  if (img.top < num + height + delay && img.top + img.height > num) {
    console.time(img.ref)
    img.setState({ load: true })
  }
}
const refreshImg = (num = 0, height = window.outerHeight, delay = 0) => {
  console.log(num, height)
  imgArr.forEach(item => {
    calcImg(item, num, height, delay)
  })
}
class LazyImg extends Component {
  constructor (props) {
    super(props)
    this.state = {
      load: false
    }
    this.imgId = 0
    this.ref = ''

    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
  }

  calcImg = calcImg

  componentDidMount () {
    this.ref = `lazy_img_${this.imgId}`
    let DOM = this.refs[this.ref]
    console.dir(DOM)
    let item = {
      ref: this.ref,
      DOM,
      setState: this.setState.bind(this),
      top: DOM.offsetTop,
      height: DOM.offsetHeight
    }
    imgArr.push(item)
    calcImg(item, 0, window.outerHeight, 1000)
  }

  componentWillMount () {
    this.imgId = Date.now()
  }

  componentWillUnmount () {
    imgArr.splice(this.imgId, 1)
    console.log(imgArr)
  }

  componentDidUpdate () {
    console.timeEnd(this.ref)
  }

  render () {
    console.log(imgArr)
    return (
      <div
        className={this.props.className}
        ref={`lazy_img_${this.imgId}`}
        style={{
          backgroundRepeat: 'no-repeat',
          backgroundImage: `${this.state.load ? `url(${this.props.src})` : ''}`,
          backgroundColor: 'gray',
          // backgroundImage: `url(${this.props.src})`,
          ...this.props.style
        }}></div>
    )
  }
}

export {
  BackDrop,
  Avatar,
  Toast,
  LazyImg,
  refreshImg
}
