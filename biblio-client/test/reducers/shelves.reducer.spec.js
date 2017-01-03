import shelfReducer from '../../src/reducers/shelves.reducer'
import * as types from '../../src/constants'
import { shelvesState } from '../../src/constants/initialState'

describe('Reducers', function() {
  var initState
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
            payload: { workId: 1, lastX: 0, lastY: 0, nextX: 1, nextY: 0 }
          }
        )

        expect(newState[0].works).to.have.length(1)
        expect(newState[1].works).to.have.length(1)
      })

      it('should properly handle moving works within a shelf (Y move)', function() {
        const newState = shelfReducer(
          initState, {
            type: types.MOVE_WORK,
            payload: { workId: 1, lastX: 0, lastY: 0, nextX: 0, nextY: 1 }
          }
          )

        expect(newState[0].works[0].title).to.eq('bar')
        expect(newState[0].works[1].title).to.eq('foo')
      })
    })
  })
})
