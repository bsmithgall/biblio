import shelfReducer from '../../src/reducers/shelves.reducer'
import * as types from '../../src/constants'
import { shelvesState } from '../../src/constants/initialState'

describe('Reducers', function() {
  var initState, newWork
  describe('shelf reducer', function() {

    beforeEach(function() {
      initState = [
        {id: 1, title: 'A', works: [{id: 1, title: 'foo'}, {id: 2, title: 'bar'}]},
        {id: 2, title: 'B', works: []}
      ]
    })

    it('should properly render the initial state', function() {
      expect(shelfReducer(undefined, {})).to.eq(shelvesState)
    })

    describe('action: MOVE_WORK', function() {
      it('should properly handle moving works to new shelves (X move)', function() {
        expect(initState[0].works).to.have.length(2)
        expect(initState[1].works).to.have.length(0)

        const newState = shelfReducer(
          initState, {
            type: types.MOVE_WORK,
            payload: { workId: 1, lastShelf: 0, lastWorkPos: 0, nextShelf: 1, nextWorkPos: 0 }
          }
        )

        expect(newState[0].works).to.have.length(1)
        expect(newState[1].works).to.have.length(1)
      })

      it('should properly handle moving works within a shelf (Y move)', function() {
        const newState = shelfReducer(
          initState, {
            type: types.MOVE_WORK,
            payload: { workId: 1, lastShelf: 0, lastWorkPos: 0, nextShelf: 0, nextWorkPos: 1 }
          }
        )

        expect(newState[0].works[0].title).to.eq('bar')
        expect(newState[0].works[1].title).to.eq('foo')
      })
    })

    describe('action: ADD_WORK', function() {
      beforeEach(function() {
        newWork = {title: 'baz'}
      })

      it('should add properly to the first shelf', function() {
        const newState = shelfReducer(
          initState, {
            type: types.ADD_WORK,
            payload: { work: newWork, shelfId: 0}
          }
        )

        expect(newState[0].works.length).to.eq(3)
        expect(newState[0].works[0].title).to.eq('baz')
      })

      it('should add properly to the second shelf', function() {
        const newState = shelfReducer(
          initState, {
            type: types.ADD_WORK,
            payload: { work: newWork, shelfId: 1}
          }
        )

        expect(newState[0].works.length).to.eq(2)
        expect(newState[1].works.length).to.eq(1)
        expect(newState[1].works[0].title).to.eq('baz')
      })
    })

    describe('action: DELETE_WORK', function() {
      it('should properly delete a work', function() {
        const newState = shelfReducer(
          initState, {
            type: types.DELETE_WORK,
            payload: { workId: 1, shelfId: 0 }
          }
        )

        expect(newState[0].works.length).to.eq(1)
        expect(newState[0].works[0].title).to.eq('bar')
      })
    })
  })
})
