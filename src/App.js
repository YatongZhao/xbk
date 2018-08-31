import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import c from './App.css';
import Main from './Components/Main'
import Register from './Components/Register'
import Login from './Components/Login'
import AddFollow from './Components/AddFollow'
import TieDetail from './Components/Star/Community/TieDetail'
import Create from './Components/Star/Community/Create'
import { intercept } from './api/login'
import ImagePreview from './Components/common/ImagePreview'
import { Toast, refreshImg } from './Components/common/Common'
import throttle from 'lodash/throttle'

class App extends Component {
  constructor(props) {
    super(props)

    this.componentWillMount = this.componentWillMount.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
  }
  componentWillMount () {
    intercept.call(this)
  }
  componentDidMount () {
    window.addEventListener('scroll', throttle((e) => {
      let top = document.body.scrollTop || document.documentElement.scrollTop
      refreshImg(top, window.outerHeight, 1000)
    }, 200))
  }
  render() {
    return (
      <div className={c.App}>
        <ImagePreview />
        <Toast></Toast>
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/add_follow" component={AddFollow} />
          <Route path="/star/:star_id/community/detail/:post_id" component={TieDetail} />
          <Route path="/star/:star_id/community/create" component={Create} />
          <Route path="/" component={Main} />
        </Switch>
      </div>
    );
  }
}

export default App;
