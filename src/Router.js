import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import App from './App'

export default class AppRouter extends React.Component {
  render() {
    return (
      <Router>
        <Route path="/" component={App} />
      </Router>
    )
  }
}
