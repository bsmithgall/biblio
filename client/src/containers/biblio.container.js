import { connect } from 'react-redux';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import Biblio from '../components/biblio.component';
import * as WorkActions from '../actions/work.actions';

const mapStateToProps = function(state) {
  return {
    biblio: state.biblio,
    shelves: state.shelves,
    user: state.user,
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    moveWork: function(workId, lastShelf, lastWork, nextShelf, nextWork) {
      dispatch(WorkActions.performMove(workId, lastShelf, lastWork, nextShelf, nextWork));
    },
    setPlaceholder: function(placeholderIndex, currentDragged, draggedDir, currentDraggedShelf, originShelf) {
      dispatch(WorkActions.setPlaceholder(placeholderIndex, currentDragged, draggedDir, currentDraggedShelf, originShelf));
    },
    addWork: function(work, shelf) { dispatch(WorkActions.addWork(work, shelf)); },
  };
};

const BiblioContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Biblio);

export default DragDropContext(HTML5Backend)(BiblioContainer);
