import { connect } from 'react-redux'

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Biblio from '../components/biblio.component'
import * as WorkActions from '../actions/work.actions'

const mapStateToProps = function(state) {
  return {
    shelves: state.shelves
  }
}

const mapDispatchToProps = function(dispatch) {
  return {
    moveWork: function(workId, lastX, lastY, nextX, nextY) {
      dispatch(WorkActions.moveWork(workId, lastX, lastY, nextX, nextY))
    }
  }
}

const BiblioContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Biblio)

export default DragDropContext(HTML5Backend)(BiblioContainer);
