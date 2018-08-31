import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../actions'
import s from './Image.css'

class Image extends Component {
  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (e) {
    const { addImage, src } = this.props
    addImage(src)
    e.stopPropagation()
    e.preventDefault()
  }
  render () {
    return (
      <React.Fragment>
        <div
          className={s.image + ' ' + this.props.className}
          onClick={this.handleClick}
          style={{
            backgroundImage: `url(${this.props.src})`,
            ...this.props.style
          }}></div>
      </React.Fragment>
    )
  }
}

function mapStateToProps ({ images }, ownProps) {
  return ownProps
}

const ConnectImage = connect(mapStateToProps, actions.images)(Image)
export default ConnectImage
