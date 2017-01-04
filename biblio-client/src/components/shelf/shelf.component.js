import React from 'react'

import ShelfTitle from './shelfTitle.component'
import ShelfList from './shelfList.component'

import NewWork from '../works/newWork.component'

export default class Shelf extends React.Component {
  render() {
    return (
      <div className="bb-shelf">
        <ShelfTitle text={this.props.title} />
        <NewWork
          addWork={this.props.addWork}
          shelfNumber={this.props.shelfNumber}
        />
        <ShelfList
          shelfNumber={this.props.shelfNumber}
          moveWork={this.props.moveWork}
          addWork={this.props.addWork}
          works={this.props.works}
        />
      </div>
    )
  }
}
