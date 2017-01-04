import React from 'react'
import { findDOMNode } from 'react-dom'

import { DropTarget } from 'react-dnd';
import * as types from '../../constants/dndTypes'
import * as sizes from '../../constants/shelfSizes'

import WorkContainer from '../../containers/work.container'

function getPlaceholderIndex(y, scrollY) {
  // shift placeholder if y position more than card height / 2
  const yPos = y - sizes.OFFSET_HEIGHT + scrollY;
  let placeholderIndex;
  if (yPos < sizes.CARD_HEIGHT / 2) {
    placeholderIndex = -1; // place at the start
  } else {
    placeholderIndex = Math.floor((yPos - sizes.CARD_HEIGHT / 2) / (sizes.CARD_HEIGHT + sizes.CARD_MARGIN));
  }
  return placeholderIndex;
}

const specs = {
  drop(props, monitor, component) {
    const { placeholderIndex } = component.state;
    const lastShelf = monitor.getItem().shelfNumber;
    const lastWork = monitor.getItem().workNumber;
    const nextShelf = props.shelfNumber;
    let nextWork = placeholderIndex;

    if (lastWork > nextWork) { // move top
      nextWork += 1;
    } else if (lastShelf !== nextShelf) { // insert into another list
      nextWork += 1;
    }

    if (lastShelf !== nextShelf || lastWork !== nextWork) {
      props.moveWork(monitor.getItem().id, lastShelf, lastWork, nextShelf, nextWork);
    }
  },
  hover(props, monitor, component) {
    // defines where placeholder is rendered
    const placeholderIndex = getPlaceholderIndex(
      monitor.getClientOffset().y,
      findDOMNode(component).scrollTop
    );

    // IMPORTANT!
    // HACK! Since there is an open bug in react-dnd, making it impossible
    // to get the current client offset through the collect function as the
    // user moves the mouse, we do this awful hack and set the state (!!)
    // on the component from here outside the component.
    // https://github.com/gaearon/react-dnd/issues/179
    component.setState({ placeholderIndex });
  }
}

function collectDropTarget(connectDragSource, monitor) {
  return {
    connectDropTarget: connectDragSource.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    item: monitor.getItem()
  }
}

class ShelfList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      placeholder: undefined
    }
  }

  render() {
    const connectDropTarget = this.props.connectDropTarget
    const works = this.props.works
    const shelfNumber = this.props.shelfNumber
    const moveWork = this.props.moveWork

    return connectDropTarget(
      <div className="bb-shelf-list">
        {works.map(function(work, idx) {
          return (
            <WorkContainer
              id={work.id}
              key={work.id}
              index={idx}
              title={work.title}
              author={work.author}
              moveWork={moveWork}
              shelfNumber={shelfNumber}
              workNumber={idx}
            />
          )
        })}
      </div>
    )
  }
}

export default DropTarget(types.WORK, specs, collectDropTarget)(ShelfList)
