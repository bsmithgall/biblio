import biblioReducer from '../../src/reducers/biblio.reducer'
import * as types from '../../src/constants'

describe('Reducers', function() {
  var initState
  describe('biblio reducer', function() {

    beforeEach(function() {
      initState = {isFetching: false}
    })

    it('should properly render the initial state', function() {
      expect(biblioReducer(undefined, {})).to.deep.eq({isFetching: false})
    })

    describe('action: FETCHING', function() {
      it('should properly set isFetching to true', function() {
        const newState = biblioReducer(initState, {type: types.FETCHING})
        expect(newState.isFetching).to.be.true
      })
    })

    describe('action: END_SHELF_FETCHING, END_WORK_FETCHING', function() {
      it('should properly end fetching for shelves', function() {
        const fetch = biblioReducer(initState, {type: types.FETCHING})
        expect(fetch.isFetching).to.be.true
        const newState = biblioReducer(fetch, {type: types.END_SHELF_FETCHING})
        expect(newState.isFetching).to.be.false
      })

      it('should properly end fetching for works', function() {
        const fetch = biblioReducer(initState, {type: types.FETCHING})
        expect(fetch.isFetching).to.be.true
        const newState = biblioReducer(fetch, {type: types.END_WORK_FETCHING})
        expect(newState.isFetching).to.be.false
      })
    })
  })
})
