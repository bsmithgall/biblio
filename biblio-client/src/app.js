import React from 'react';
import BiblioContainer from './containers/biblio.container'
import NavBar from './components/navbar.component'

class App extends React.Component {
  render() {
    return (
      <div className="bb-app-root">
        <NavBar />
        <BiblioContainer />
      </div>
    );
  }
}

export default App
