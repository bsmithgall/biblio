import React from 'react'

import Shelf from './shelf/shelf.component'

export default class Biblio extends React.Component {
  render() {
    const { shelves, moveWork, addWork } = this.props

    return (
      <div className="bb-biblio bb-shelf-container">
        {shelves.map(function(shelf, idx) {
          return (
            <Shelf
              key={shelf.id}
              title={shelf.title}
              works={shelf.works}
              shelfNumber={idx}
              addWork={addWork}
              moveWork={moveWork}
            />
          )
        })}
      </div>
    )
  }
}

