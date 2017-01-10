import { connect } from 'react-redux'

import React from 'react';
import BiblioContainer from './containers/biblio.container'
import NavBar from './components/navbar.component'

import { getShelves } from './actions/shelf.actions'

class App extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getShelves)
  }

  render() {
    return (
      <div className="bb-app-root">
        <NavBar isFetching={this.props.biblio.isFetching} />
        <BiblioContainer />
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return state
}

export default connect(mapStateToProps)(App)
