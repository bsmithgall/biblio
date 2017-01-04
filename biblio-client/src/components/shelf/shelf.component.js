import React from 'react'

import ShelfTitle from './shelfTitle.component'
import ShelfList from './shelfList.component'

export default class Shelf extends React.Component {
  render() {
    return (
      <div className="bb-shelf">
        <ShelfTitle text={this.props.title} />
        <ShelfList
          shelfNumber={this.props.shelfNumber}
          moveWork={this.props.moveWork}
          works={this.props.works}
        />
      </div>
    )
  }
}
