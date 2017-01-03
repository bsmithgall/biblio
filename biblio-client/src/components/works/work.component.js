import React from 'react'
import { findDOMNode } from 'react-dom'

import { DragSource } from 'react-dnd'

import * as types from '../../constants/dndTypes'

function collectDragSource(connectDragSource, monitor) {
  return {
    connectDragSource: connectDragSource.dragSource(),
    connectDragPreview: connectDragSource.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

const workSource = {
  beginDrag(props, _, component) {
    const { clientWidth, clientHeight } = findDOMNode(component);

    return {
      id: props.id,
      title: props.tite,
      x: props.x,
      y: props.y,
      clientWidth: clientWidth,
      clientHeight: clientHeight
    }
  },
  isDragging(props, monitor) {
    const isDragging = props.id && props.id === monitor.getItem().id;
    return isDragging;
  }
};

const OPTIONS = {
  arePropsEqual: function arePropsEqual(props, otherProps) {
    let isEqual = true;
    if (props.id === otherProps.id &&
        props.x === otherProps.x &&
        props.y === otherProps.y
       ) {
      isEqual = true;
    } else {
      isEqual = false;
    }
    return isEqual;
  }
};

class Work extends React.Component {
  render() {
    return this.props.connectDragSource(
      <div
        className="bb-work comment"
        id={this.props.id}
      >
        <div className="comment-content">
          <h1>{this.props.title}</h1>
          <p>Foobar</p>
        </div>
      </div>
    )
  }
}

export default DragSource(types.WORK, workSource, collectDragSource, OPTIONS)(Work)
