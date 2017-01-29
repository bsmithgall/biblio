import { connect } from 'react-redux'

import React from 'react';
import BiblioContainer from './containers/biblio.container'
import NavBar from './components/navbar.component'

import { getShelves } from './actions/shelf.actions'
import { getUser } from './actions/user.actions'

class App extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getUser)
    dispatch(getShelves)
  }

  render() {
    return (
      <div className="bb-app-root">
        <NavBar
          isFetching={this.props.biblio.isFetching}
          user={this.props.user}
        />
        <BiblioContainer />
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return state
}

export default connect(mapStateToProps)(App)
