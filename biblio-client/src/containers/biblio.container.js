import { connect } from 'react-redux'
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

export default BiblioContainer
