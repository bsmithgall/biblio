import * as types from '../constants'

export function moveWork(workId, lastX, lastY, nextX, nextY) {
  return {
    type: types.MOVE_WORK,
    payload: {
      workId: workId,
      lastX: lastX,
      lastY: lastY,
      nextX: nextX,
      nextY: nextY
    }
  }
}
