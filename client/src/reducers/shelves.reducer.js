import { shelvesState } from '../constants/initialState'
import shortid from 'shortid'

import * as types from '../constants'

const shelves = function(state = shelvesState, action) {
  switch(action.type) {
    case types.ADD_WORK: {
      const newState = [...state]
      const { work, shelfId } = action.payload

      work.id = shortid.generate()

      newState[shelfId].works.unshift(work)
      return newState
    }

    case types.MOVE_WORK: {
      const newState = [...state]
      const { lastShelf, lastWorkPos, nextShelf, nextWorkPos } = action.payload;

      // no X move: moving a work up/down in an existing shelf
      if (lastShelf === nextShelf) {
        newState[lastShelf].works.splice(nextWorkPos, 0, newState[lastShelf].works.splice(lastWorkPos, 1)[0]);
      } else {
        newState[nextShelf].works.splice(nextWorkPos, 0, newState[lastShelf].works[lastWorkPos]);
        newState[lastShelf].works.splice(lastWorkPos, 1);
      }

      return newState
    }

    case types.DELETE_WORK: {
      const newState = [...state]

      const { workId, shelfId } = action.payload
      const shelfWorksIds = newState[shelfId].works.map(function(e) { return e.id })

      newState[shelfId].works.splice(shelfWorksIds.indexOf(workId), 1)

      return newState
    }

    default: {
      return state
    }
  }
}

export default shelves
