import React from 'react'

class LoginURL extends React.Component {
  render() {
    return <li className="nav-link"><a href={this.props.user.url}>Login</a></li>
  }
}

class UserProfile extends React.Component {
  render() {
    return <li className="nav-link"><a>{this.props.user.displayName}</a></li>
  }
}

export default class User extends React.Component {
  render() {
    const user = this.props.user

    let li = null
    if (user.hasOwnProperty('display_name')) {
      li = <UserProfile user={user}/>
    } else {
      li = <LoginURL user={user}/>
    }

    return(
      <div className="bb-user-profile">
        <ul className="navigation-menu show">
          {li}
        </ul>
      </div>
    )
  }
}
