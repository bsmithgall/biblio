import * as types from '../constants'

export function deleteWork(workId, shelfId) {
  return {
    type: types.DELETE_WORK,
    payload: {
      workId: workId,
      shelfId: shelfId
    }
  }
}
