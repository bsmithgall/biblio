import React from 'react';
import { findDOMNode } from 'react-dom';
import flow from 'lodash/flow';
import { DragSource, DropTarget } from 'react-dnd';
import { DRAG_WORK } from '../../constants';

class Work extends React.Component {
  constructor(props) {
    super(props);
    this.clickDelete = this.clickDelete.bind(this);
  }

  render() {
    const { id, title, author, connectDragSource, connectDropTarget } = this.props;

    return connectDragSource(connectDropTarget(
      <div
        className="bb-work"
        id={id}
      >
        <div className="bb-work-content">
          <h1>{title}</h1>
          <p>{author}</p>
        </div>
        <div className="bb-work-delete" onClick={this.clickDelete}>
          🗑
        </div>
      </div>
    ));
  }

  clickDelete() {
    if (confirm('Are you sure you want to remove ' + this.props.title + ' from your biblio?')) {
      this.props.deleteWork(this.props.id, this.props.shelfNumber);
    }
  }
}

Work.propTypes = {
  id: React.PropTypes.number.isRequired,
  title: React.PropTypes.string.isRequired,
  author: React.PropTypes.string.isRequired,
  shelfNumber: React.PropTypes.number.isRequired,
  setPlaceholder: React.PropTypes.func,
  connectDragSource: React.PropTypes.func,
  connectDropTarget: React.PropTypes.func,
  deleteWork: React.PropTypes.func,
};

const workDragSource = {
  beginDrag: function(props) {
    return {
      id: props.id,
      shelfId: props.shelfNumber,
      position: props.position,
    };
  },

  endDrag: function(props) {
    props.setPlaceholder(-1, -1, '');
  },
};

const workDropTarget = {
  hover: function hover(props, monitor, component) {
    const item = monitor.getItem();
    const draggedPosition = item.position;
    const hoverPosition = props.position;

    // find the middle of things
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // don't move until we are halfway over the card
    if (draggedPosition < hoverPosition && hoverClientY < hoverMiddleY) return;
    if (draggedPosition > hoverPosition && hoverClientY > hoverMiddleY) return;

    // insert a display placeholder at an appropriate position
    const dragDir = draggedPosition > hoverPosition ? 'up' : 'down';
    props.setPlaceholder(draggedPosition, hoverPosition, dragDir);
  },
};

export default flow(
  DragSource(DRAG_WORK, workDragSource, function(connect) {
    return {
      connectDragSource: connect.dragSource(),
    };
  }),
  DropTarget(DRAG_WORK, workDropTarget, function(connect) {
    return {
      connectDropTarget: connect.dropTarget(),
    };
  })
)(Work);
