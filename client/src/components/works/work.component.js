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

  clickDelete() {
    if (confirm('Are you sure you want to remove ' + this.props.title + ' from your biblio?')) {
      this.props.deleteWork(this.props.id, this.props.shelfNumber);
    }
  }

  render() {
    const { id, title, author, connectDragSource, connectDropTarget } = this.props;

    return connectDropTarget(connectDragSource(
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
}

Work.propTypes = {
  id: React.PropTypes.number.isRequired,
  title: React.PropTypes.string.isRequired,
  author: React.PropTypes.string.isRequired,
  shelfNumber: React.PropTypes.number.isRequired,
  currentPlaceholder: React.PropTypes.number,
  placeholder: React.PropTypes.object,
  setPlaceholder: React.PropTypes.func,
  connectDragSource: React.PropTypes.func,
  connectDropTarget: React.PropTypes.func,
  moveWork: React.PropTypes.func,
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
  endDrag: function(props, monitor) {
    const didDrop = monitor.didDrop();
    if (!didDrop) {
      props.setPlaceholder(-1, -1, '', -1);
    }
  }
};

const workDropTarget = {
  hover: function(props, monitor, component) {
    const item = monitor.getItem();
    const { placeholderIndex, currentDraggedShelf, draggedDir } = props.placeholder;

    // end early if we are hovering over the original spot
    if (props.position === item.position && props.shelfNumber === item.shelfId) {
      if (placeholderIndex > -1) {
        props.setPlaceholder(-1, -1, '', -1, -1);
      }
      return;
    }

    // find the middle of things
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // don't move until we are halfway over the card
    if (item.position < props.position && hoverClientY < hoverMiddleY) return;
    if (item.position > props.position && hoverClientY > hoverMiddleY) return;

    // insert a display placeholder at an appropriate position
    const dragDir = hoverClientY < hoverMiddleY ? 'up' : 'down';

    // end early if we are hovering over the spot where our placeholder already is
    if (placeholderIndex === props.position &&
      currentDraggedShelf === props.shelfNumber &&
      dragDir === draggedDir) return;

    props.setPlaceholder(item.position, props.position, dragDir, props.shelfNumber, item.shelfId);
  },
  drop: function(props, monitor) {
    props.setPlaceholder(-1, -1, '', -1, -1);
    const item = monitor.getItem();
    props.moveWork(item.shelfId, item.position, props.shelfNumber, props.position);
  },
};

export default flow(
  DropTarget(DRAG_WORK, workDropTarget, function(connect, monitor) {
    return {
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
    };
  }),
  DragSource(DRAG_WORK, workDragSource, function(connect) {
    return {
      connectDragSource: connect.dragSource(),
    };
  }),
)(Work);
