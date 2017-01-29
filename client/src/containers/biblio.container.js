import { connect } from 'react-redux'

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Biblio from '../components/biblio.component'
import * as WorkActions from '../actions/work.actions'

const mapStateToProps = function(state) {
  return {
    biblio: state.biblio,
    shelves: state.shelves,
    user: state.user
  }
}

const mapDispatchToProps = function(dispatch) {
  return {
    moveWork: function(workId, lastShelf, lastWork, nextShelf, nextWork) {
      dispatch(WorkActions.moveWork(workId, lastShelf, lastWork, nextShelf, nextWork))
    },
    addWork: function(work, shelf) { dispatch(WorkActions.addWork(work, shelf)) }
  }
}

const BiblioContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Biblio)

export default DragDropContext(HTML5Backend)(BiblioContainer);
