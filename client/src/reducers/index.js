import { combineReducers } from 'redux'
import shelf from './shelf.reducer'
import biblio from './biblio.reducer'

export default combineReducers({
  biblio,
  shelves
})
