import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom'

import { DragSource } from 'react-dnd'

import * as types from '../constants'
import * as WorkActions from '../actions/work.actions'
import Work from '../components/works/work.component'

const mapStateToProps = function(state) {
  return state;
}

const mapDispatchToProps = function(dispatch) {
  return {
    deleteWork: function(workId, shelfId) { dispatch(WorkActions.deleteWork(workId, shelfId)) }
  }
}

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
      work: props.work,
      position: props.position,
      clientWidth: clientWidth,
      clientHeight: clientHeight
    }
  },
  isDragging(props, monitor) {
    const isDragging = props.id && props.id === monitor.getItem().work.id;
    return isDragging;
  }
};

const OPTIONS = {
  arePropsEqual: function arePropsEqual(props, otherProps) {
    let isEqual = true;
    if (props.id === otherProps.id &&
        props.shelfNumber === otherProps.shelfNumber &&
        props.workNumber === otherProps.workNumber
       ) {
      isEqual = true;
    } else {
      isEqual = false;
    }
    return isEqual;
  }
};

const WorkContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Work)

export default DragSource(types.DND_WORK, workSource, collectDragSource, OPTIONS)(WorkContainer)
