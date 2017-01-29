import React from 'react'

import Fetching from './fetching.component'
import User from './user.component'

export default class NavBar extends React.Component {
  render() {
    return (
      <header className="navigation" role="banner">
        <div className="navigation-wrapper">
          <a href="" className="logo">
            <img src="https://raw.githubusercontent.com/thoughtbot/refills/master/source/images/placeholder_square.png" alt="Biblio" />
          </a>
          <a href="" className="navigation-menu-button" id="js-mobile-menu">MENU</a>
          <nav role="navigation">
            <ul id="js-navigation-menu" className="navigation-menu show">
            </ul>
          </nav>
          <div className="navigation-tools">
            <Fetching isFetching={this.props.isFetching} />
            <User user={this.props.user} />
          </div>
        </div>
      </header>
    )
  }
}
