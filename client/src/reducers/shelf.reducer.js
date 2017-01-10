import * as types from '../constants'

const shelves = function(state = [], action) {
  switch(action.type) {
    // this is the first fetch, so just return it
    case types.END_SHELF_FETCHING:
      return action.payload.shelves

    case types.ADD_WORK: {
      const newState = [...state]
      const { work, shelfId } = action.payload

      newState.find(function(e) {return e.id === shelfId}).works.unshift(work)
      return newState
    }

    case types.MOVE_WORK: {
      const newState = [...state]
      const { lastShelfId, lastWorkPos, nextShelfId, nextWorkPos } = action.payload;
      const lastShelf = newState.find(function(e) { return e.id === lastShelfId })
      const nextShelf = newState.find(function(e) { return e.id === nextShelfId })

      // no X move: moving a work up/down in an existing shelf
      if (lastShelfId === nextShelfId) {
        lastShelf.works.splice(nextWorkPos, 0, lastShelf.works.splice(lastWorkPos, 1)[0]);
      } else {
        nextShelf.works.splice(nextWorkPos, 0, lastShelf.works[lastWorkPos]);
        lastShelf.works.splice(lastWorkPos, 1);
      }
      return newState
    }

    case types.DELETE_WORK: {
      const newState = [...state]
      const { workId, shelfId } = action.payload

      const thisShelf = newState.find(function(e) {return e.id === shelfId })
      const shelfWorksIds = thisShelf.works.map(function(e) { return e.id })

      thisShelf.works.splice(shelfWorksIds.indexOf(workId), 1)

      return newState
    }

    default:
      return state
  }
}

export default shelves
