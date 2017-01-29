import * as types from '../constants'

const biblio = function(state = {isFetching: false}, action) {
  var newState
  switch(action.type) {
    case types.FETCHING: {
      newState = Object.assign({}, state)
      newState.isFetching = true
      return newState
    }

    case types.END_SHELF_FETCHING:
    case types.END_USER_FETCHING:
    case types.END_WORK_FETCHING: {
      newState = Object.assign({}, state)
      newState.isFetching = false
      return newState
    }

    default:
      return state
  }
}

export default biblio
