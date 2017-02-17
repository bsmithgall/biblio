import * as types from '../constants';

const shelves = function(state = {shelves: [], placeholder: {}}, action) {
  const newState = Object.assign({}, state);
  switch (action.type) {

  case types.END_SHELF_FETCHING:
    newState.shelves = action.payload.shelves;
    return newState;

  case types.ADD_WORK: {
    const { work, shelfId } = action.payload;

    newState.shelves.find(function(e) { return e.id === shelfId; }).works.unshift(work);
    return newState;
  }

  case types.DRAG_WORK_PLACEHOLDER: {
    newState.placeholder = action.payload;
    return newState;
  }

  case types.MOVE_WORK: {
    const { lastShelfId, lastWorkPos, nextShelfId, nextWorkPos } = action.payload;
    const lastShelf = newState.shelves.find(function(e) { return e.id === lastShelfId; });
    const nextShelf = newState.shelves.find(function(e) { return e.id === nextShelfId; });

    // no X move: moving a work up/down in an existing shelf
    if (lastShelfId === nextShelfId) {
      lastShelf.works.splice(nextWorkPos, 0, lastShelf.works.splice(lastWorkPos, 1)[0]);
    } else {
      nextShelf.works.splice(nextWorkPos, 0, lastShelf.works[lastWorkPos]);
      lastShelf.works.splice(lastWorkPos, 1);
    }
    return newState;
  }

  case types.DELETE_WORK: {
    const { workId, shelfId } = action.payload;

    const thisShelf = newState.shelves.find(function(e) {return e.id === shelfId; });
    const shelfWorksIds = thisShelf.works.map(function(e) { return e.id; });

    thisShelf.works.splice(shelfWorksIds.indexOf(workId), 1);

    return newState;
  }

  default:
    return state;
  }
};

export default shelves;
