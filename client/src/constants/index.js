// work actions
export const ADD_WORK = 'work.add_work'
export const MOVE_WORK = 'work.move_work'
export const DELETE_WORK = 'work.delete_work'

// shelf actions
export const LIST_SHELVES = 'shelf.list_shelves'

// app actions
export const FETCHING = 'biblio.now_fetching'
export const END_SHELF_FETCHING = 'biblio.end_shelf_fetching'
export const END_WORK_FETCHING = 'biblio.end_work_fetching'

// api endpoints
var API_ENDPOINT
switch (process.env['NODE_ENV']) {
  case 'development':
    API_ENDPOINT = 'http://localhost:8080/api/v1'
    break
  case 'production':
    API_ENDPOINT = 'https://biblio-155121.appspot.com/api/v1'
    break
  case 'test':
    API_ENDPOINT = 'test:test'
    break
  default:
    API_ENDPOINT = '/api/v1'
    break
}

export { API_ENDPOINT }
