import { combineReducers } from 'redux'
import shelves from './shelf.reducer'
import biblio from './biblio.reducer'
import user from './user.reducer'

export default combineReducers({
  biblio,
  shelves,
  user
})
