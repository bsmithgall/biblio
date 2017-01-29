import * as constants from '../constants'

function fetchingShelves() {
  return { type: constants.FETCHING }
}

function receivedShelves(shelves) {
  return {
    type: constants.END_SHELF_FETCHING,
    payload: {
      shelves: shelves
    }
  }
}

function fetchShelves(dispatch) {
  return function(dispatch) {
    dispatch(fetchingShelves())
    return fetch(constants.API_ENDPOINT + '/shelves')
      .then(function(response) { return response.json() })
      .then(function(json) {
        dispatch(receivedShelves(json))
      })
  }
}

export function getShelves(dispatch) {
  return dispatch(fetchShelves())
}
