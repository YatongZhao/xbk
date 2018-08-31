import React, { Component } from 'react'

class StatBox extends Component {
  constructor (props) {
    super(props)
    this.state = {
      arr: [1, 2, 3, 4, 5]
    }
  }
  render () {
    return (
      <div>
        {this.state.arr.map((num, index) => (
          <div key={num}>
            <div>1000天</div>
            <div>已关注他</div>
          </div>
        ))}
      </div>
    )
  }
}

class StarOrbit extends Component {
  render () {
    return (
      <div>
        <div>在接广告</div>
        <div>20家</div>
        <div>详情>>></div>
      </div>
    )
  }
}

class Billbord extends Component {
  render () {
    return (
      <div className="billbord">
        {/* <StatBox></StatBox>
        <div>星迹</div>
        <StarOrbit></StarOrbit>
        <StarOrbit></StarOrbit>
        <StarOrbit></StarOrbit>
        <StarOrbit></StarOrbit> */}
      </div>
    )
  }
}

export default Billbord
