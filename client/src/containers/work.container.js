import { connect } from 'react-redux'

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

const WorkContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Work)

export default WorkContainer
