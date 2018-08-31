import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import AppFooter from '../common/AppFooter';
import Home from '../Home';
import Star from '../Star';
import User from '../User';

class Main extends Component {
  render() {
    return (
      <React.Fragment>
        <div>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/star/:star_id" component={Star} />
            <Route path="/user" component={User} />
          </Switch>
        </div>
        <AppFooter />
      </React.Fragment>
    );
  }
}

export default Main;
