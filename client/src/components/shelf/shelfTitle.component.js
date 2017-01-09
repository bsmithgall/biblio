import React from 'react'

export default class ShelfTitle extends React.Component {
  render() {
    return (
      <div className="bb-shelf-title">
        <h1>{this.props.text}</h1>
      </div>
    )
  }
}
