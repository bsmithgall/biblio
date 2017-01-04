import { shelvesState } from '../constants/initialState'
import shortid from 'shortid'

import * as types from '../constants'

const shelves = function(state = shelvesState, action) {
  let newState
  switch(action.type) {
    case types.ADD_WORK:
      newState = [...state]
      const { work, shelfId } = action.payload

      work.id = shortid.generate()
      debugger;

      newState[shelfId].works.unshift(work)
      return newState

    case types.MOVE_WORK:
      newState = [...state]
      const { lastShelf, lastWorkPos, nextShelf, nextWorkPos } = action.payload;

      // no X move: moving a work up/down in an existing shelf
      if (lastShelf === nextShelf) {
        newState[lastShelf].works.splice(nextWorkPos, 0, newState[lastShelf].works.splice(lastWorkPos, 1)[0]);
      } else {
        newState[nextShelf].works.splice(nextWorkPos, 0, newState[lastShelf].works[lastWorkPos]);
        newState[lastShelf].works.splice(lastWorkPos, 1);
      }

      return newState

    default:
      return state
  }
}

export default shelves
