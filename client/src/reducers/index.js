import { combineReducers } from 'redux'
import works from './works.reducer'
import shelves from './shelves.reducer'

export default combineReducers({
  shelves,
  works
})
