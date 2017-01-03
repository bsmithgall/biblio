import React from 'react'

import { DragDropContext, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import flow from 'lodash/flow';
import * as types from '../../constants/dndTypes'

import Work from '../works/work.component.js'

const specs = {
  drop(props, monitor, component) {
    const lastX = monitor.getItem().x;
    const lastY = monitor.getItem().y;
    const nextX = props.x;
    let nextY = props.y;

    if (lastX === nextX && lastY === nextY) {
      return;
    }

    if (lastY > nextY) {
      nextY += 1;
    } else if (lastX !== nextX) {
      nextY += 1;
    }
    props.moveWork(props.id, lastX, lastY, nextX, nextY);
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

class Shelf extends React.Component {
  render() {
    const connectDropTarget = this.props.connectDropTarget
    const works = this.props.works
    const x = this.props.x
    const moveWork = this.props.moveWork

    return connectDropTarget(
      <div className="bb-shelf">
        <div className="bb-shelf-title"><h1>{this.props.title}</h1></div>
        {works.map(function(work, i) {
          return (
            <Work
              id={work.id}
              key={work.id}
              index={i}
              title={work.title}
              moveWork={moveWork}
              x={x}
              y={i}
            />
          )
        })}
      </div>
    )
  }
}

export default flow(
  DropTarget(types.WORK, specs, collectDropTarget),
  DragDropContext(HTML5Backend)
)(Shelf)
