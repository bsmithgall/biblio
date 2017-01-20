import { combineReducers } from 'redux'
import shelves from './shelf.reducer'
import biblio from './biblio.reducer'

export default combineReducers({
  biblio,
  shelves
})
