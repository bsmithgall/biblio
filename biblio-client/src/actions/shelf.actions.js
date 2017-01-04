import * as types from '../constants'

export function addWork(work, shelfId) {
  return {
    type: types.ADD_WORK,
    payload: {
      work: work,
      shelfId: shelfId
    }
  }
}

export function moveWork(workId, lastShelf, lastWorkPos, nextShelf, nextWorkPos) {
  return {
    type: types.MOVE_WORK,
    payload: {
      workId: workId,
      lastShelf: lastShelf,
      lastWorkPos: lastWorkPos,
      nextShelf: nextShelf,
      nextWorkPos: nextWorkPos
    }
  }
}

