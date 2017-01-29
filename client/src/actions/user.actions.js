import * as constants from '../constants'

export function fetchingUser() {
  return { type: constants.FETCHING }
}

export function receivedUser(user) {
  return {
    type: constants.END_USER_FETCHING,
    payload: {
      user: user
    }
  }
}

export function fetchUser(dispatch) {
  return function(dispatch) {
    dispatch(fetchingUser())
    return fetch(constants.API_ENDPOINT + '/user')
      .then(function(response) { return response.json() })
      .then(function(json) {
        dispatch(receivedUser(json))
      })
  }
}

export function getUser(dispatch) {
  return dispatch(fetchUser())
}
