import React from 'react'
import { findDOMNode } from 'react-dom'

import { DropTarget } from 'react-dnd';
import * as constants from '../../constants'

import WorkContainer from '../../containers/work.container'

function getPlaceholderIndex(y, scrollY) {
  // shift placeholder if y position more than card height / 2
  const yPos = y - constants.OFFSET_HEIGHT + scrollY;
  let placeholderIndex;
  if (yPos < constants.CARD_HEIGHT / 2) {
    placeholderIndex = -1; // place at the start
  } else {
    placeholderIndex = Math.floor((yPos - constants.CARD_HEIGHT / 2) / (constants.CARD_HEIGHT + constants.CARD_MARGIN));
  }
  return placeholderIndex;
}

const specs = {
  drop(props, monitor, component) {
    const { placeholderIndex } = component.state;
    const work = monitor.getItem().work
    const lastShelf = work.shelfId;
    const nextShelf = props.shelfNumber;
    const lastWorkPosition = monitor.getItem().position;
    let nextWorkPosition = placeholderIndex;

    if (lastWorkPosition > nextWorkPosition) { // move top
      nextWorkPosition += 1;
    } else if (lastShelf !== nextShelf) { // insert into another list
      nextWorkPosition += 1;
    }

    if (lastShelf !== nextShelf || lastWorkPosition !== nextWorkPosition) {
      props.moveWork(work, lastShelf, lastWorkPosition, nextShelf, nextWorkPosition);
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
              position={idx}
              title={work.title}
              author={work.author}
              moveWork={moveWork}
              shelfNumber={shelfNumber}
              work={work}
            />
          )
        })}
      </div>
    )
  }
}

export default DropTarget(constants.DND_WORK, specs, collectDropTarget)(ShelfList)
