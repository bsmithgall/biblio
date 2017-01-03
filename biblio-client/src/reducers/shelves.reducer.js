import { shelvesState } from '../constants/initialState'

import * as types from '../constants'

const shelves = function(state = shelvesState, action) {
  switch(action.type) {
    case types.MOVE_WORK:
      const newState = [...state]
      const { lastX, lastY, nextX, nextY } = action.payload;

      // no X move: moving a work up/down in an existing shelf
      if (lastX === nextX) {
        newState[lastX].works.splice(nextY, 0, newState[lastX].works.splice(lastY, 1)[0]);
      } else {
        newState[nextX].works.splice(nextY, 0, newState[lastX].works[lastY]);
        newState[lastX].works.splice(lastY, 1);
      }

      return newState

    default:
      return state
  }
}

export default shelves
