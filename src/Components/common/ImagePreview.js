import React, { Component } from 'react'
import { BackDrop } from './Common'
import { connect } from 'react-redux'
import actions from '../../actions'

class ImagePreview extends Component {
  constructor (props) {
    super(props)

    this.handleBackDropClick = this.handleBackDropClick.bind(this)
  }

  handleBackDropClick () {
    let { removeImage } = this.props
    removeImage()
  }

  render () {
    let { show, src } = this.props
    return (
      <BackDrop
        show={show ? 1 : 0}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onClick={this.handleBackDropClick}>
          <img src={src} style={{
            width: '100%'
          }}/>
      </BackDrop>
    )
  }
}

function mapStateToProps ({ images }, ownProps) {
  return {
    src: images.src,
    show: images.active
  }
}

const ConnectImagePreview = connect(mapStateToProps, actions.images)(ImagePreview)
export default ConnectImagePreview
