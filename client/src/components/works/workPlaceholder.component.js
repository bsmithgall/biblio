import React from 'react';
import { DropTarget } from 'react-dnd';
import { DRAG_WORK } from '../../constants';

class WorkPlaceholder extends React.Component {
  render() {
    return this.props.connectDropTarget(
      <div
        className="bb-work bb-work-placeholder"
      />
    );
  }
}

WorkPlaceholder.propTypes = {
  connectDropTarget: React.PropTypes.func,
  setPlaceholder: React.PropTypes.func,
  moveWork: React.PropTypes.func,
  shelfNumber: React.PropTypes.number,
  position: React.PropTypes.number,
};

const workPlaceholderTarget = {
  drop: function(props, monitor) {
    props.setPlaceholder(-1, -1, '', -1);
    const item = monitor.getItem();
    props.moveWork(item.shelfId, item.position, props.shelfNumber, props.position);
  },
};

export default DropTarget(DRAG_WORK, workPlaceholderTarget, function(connect) {
  return {
    connectDropTarget: connect.dropTarget(),
  };
})(WorkPlaceholder);
