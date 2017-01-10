import React from 'react'

import Fetching from './fetching.component'

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
              <li className="nav-link"><a href="">Products</a></li>
              <li className="nav-link"><a href="">About Us</a></li>
              <li className="nav-link"><a href="">Contact</a></li>
            </ul>
          </nav>
          <div className="navigation-tools">
            <Fetching isFetching={this.props.isFetching} />
          </div>
        </div>
      </header>
    )
  }
}
