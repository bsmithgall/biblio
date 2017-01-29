import userReducer from '../../src/reducers/user.reducer'
import * as types from '../../src/constants'

describe('Reducers', function() {
  var initState, newState
  describe('biblio reducer', function() {

    beforeEach(function() {
      initState = {displayName: ''}
    })

    it('should properly render the initial state', function() {
      expect(userReducer(undefined, {})).to.deep.equal({})
    })

    describe('action: GET_USER', function() {
      it('should properly reduce to the correct user', function() {
        var user = { displayName: 'foo', id: 1234 }
        newState = userReducer(initState, {
          type: types.END_USER_FETCHING,
          payload: {user: user}
        })

        expect(newState).to.deep.equal(user)
      })
    })
  })
})
