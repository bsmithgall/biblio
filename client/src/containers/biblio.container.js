import { connect } from 'react-redux'

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Biblio from '../components/biblio.component'
import * as ShelfActions from '../actions/shelf.actions'

const mapStateToProps = function(state) {
  return {
    shelves: state.shelves
  }
}

const mapDispatchToProps = function(dispatch) {
  return {
    moveWork: function(workId, lastShelf, lastWork, nextShelf, nextWork) {
      dispatch(ShelfActions.moveWork(workId, lastShelf, lastWork, nextShelf, nextWork))
    },
    addWork: function(work, shelf) { dispatch(ShelfActions.addWork(work, shelf)) }
  }
}

const BiblioContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Biblio)

export default DragDropContext(HTML5Backend)(BiblioContainer);
