import * as types from '../constants'

function updateWork() {
  return { type: types.FETCHING }
}

function endUpdateWork(work) {
  return {
    type: types.END_WORK_FETCHING,
    payload: {
      work: work
    }
  }
}

function addNewWork(work, shelfId) {
  return {
    type: types.ADD_WORK,
    payload: {
      work: work,
      shelfId: shelfId
    }
  }
}

export function addWork(work, shelfId) {
  return function(dispatch) {
    dispatch(updateWork())
    return fetch(types.API_ENDPOINT + '/works', {
      method: "POST",
      body: JSON.stringify(Object.assign({}, work, {shelfId: shelfId}))
    })
      .then(function(response) { return response.json() })
      .then(function(json) {
        dispatch(addNewWork(json, shelfId))
        dispatch(endUpdateWork())
      })
  }
}

export function performMove(lastShelf, lastWorkPos, nextShelf, nextWorkPos) {
  return {
    type: types.MOVE_WORK,
    payload: {
      lastShelfId: lastShelf,
      lastWorkPos: lastWorkPos,
      nextShelfId: nextShelf,
      nextWorkPos: nextWorkPos
    }
  }
}

export function moveWork(work, lastShelf, lastWorkPos, nextShelf, nextWorkPos) {
  return function(dispatch) {
    dispatch(updateWork())
    return fetch(types.API_ENDPOINT + '/works/' + work.id, {
      method: "PUT",
      body: JSON.stringify(Object.assign({}, work, {shelfId: nextShelf, position: nextWorkPos}))
    })
      .then(function(response) { return response.json() })
      .then(function(json) {
        dispatch(performMove(lastShelf, lastWorkPos, nextShelf, nextWorkPos))
        dispatch(endUpdateWork())
      })
  }
}

function performDeleteWork(workId, shelfId) {
  return {
    type: types.DELETE_WORK,
    payload: {
      workId: workId,
      shelfId: shelfId
    }
  }
}

export function deleteWork(workId, shelfId) {
  return function(dispatch) {
    dispatch(updateWork())
    return fetch(types.API_ENDPOINT + '/works/' + workId, {method: "DELETE"})
      .then(function(response) {
        dispatch(performDeleteWork(workId, shelfId))
        dispatch(endUpdateWork())
      })
  }
}
