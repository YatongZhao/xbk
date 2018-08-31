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

export {
  BackDrop,
  Avatar,
  Toast
}
