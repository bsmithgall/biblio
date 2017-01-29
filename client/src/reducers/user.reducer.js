import * as types from '../constants'

const user = function(state = {}, action) {
  var newState
  switch(action.type) {
    case types.END_USER_FETCHING:
      newState = Object.assign({}, state, action.payload.user)
      return newState

    default:
      return state
  }
}

export default user
