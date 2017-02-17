import shelfReducer from '../../src/reducers/shelf.reducer';
import * as types from '../../src/constants';

describe('Reducers', function() {
  let initState, newWork, work;
  describe('shelf reducer', function() {
    beforeEach(function() {
      work = {id: 1, title: 'foo'};
      initState = {
        shelves: [
          {id: 1, title: 'A', works: [{id: 1, title: 'foo'}, {id: 2, title: 'bar'}]},
          {id: 2, title: 'B', works: []},
        ],
        placeholder: {},
      };
    });

    it('should properly render the initial state', function() {
      expect(shelfReducer(undefined, {})).to.deep.eq({shelves: [], placeholder: {}});
    });

    describe('action: END_SHELF_FETCHING', function() {
      const newState = shelfReducer(
        initState, {
          type: types.END_SHELF_FETCHING,
          payload: { shelves: [1, 2, 3] },
        }
      );

      expect(newState.shelves).to.have.length(3);
      expect(newState.shelves).to.deep.eq([1, 2, 3]);
    });

    describe('action: ADD_WORK', function() {
      beforeEach(function() {
        newWork = {title: 'baz'};
      });

      it('should add properly to the first shelf', function() {
        const newState = shelfReducer(
          initState, {
            type: types.ADD_WORK,
            payload: { work: newWork, shelfId: 1},
          }
        );

        expect(newState.shelves[0].works.length).to.eq(3);
        expect(newState.shelves[0].works[0].title).to.eq('baz');
      });

      it('should add properly to the second shelf', function() {
        const newState = shelfReducer(
          initState, {
            type: types.ADD_WORK,
            payload: { work: newWork, shelfId: 2},
          }
        );

        expect(newState.shelves[0].works.length).to.eq(2);
        expect(newState.shelves[1].works.length).to.eq(1);
        expect(newState.shelves[1].works[0].title).to.eq('baz');
      });
    });

    describe('action: DRAG_WORK_PLACEHOLDER', function() {
      it('should properly set the placeholder properties', function() {
        expect(initState.placeholder).to.deep.equal({});

        const newState = shelfReducer(
          initState, {
            type: types.DRAG_WORK_PLACEHOLDER,
            payload: {
              currentDragged: 1,
              placeholderIndex: 2,
              draggedDir: 'up',
              currentDraggedShelf: 4,
              originShelf: 5,
            },
          }
        );

        expect(newState.placeholder).to.have.all.keys(
          'currentDragged', 'placeholderIndex', 'draggedDir', 'currentDraggedShelf', 'originShelf'
        );
      });
    });

    describe('action: MOVE_WORK', function() {
      it('should properly handle moving works to new shelves (X move)', function() {
        expect(initState.shelves[0].works).to.have.length(2);
        expect(initState.shelves[1].works).to.have.length(0);

        const newState = shelfReducer(
          initState, {
            type: types.MOVE_WORK,
            payload: { work: work, lastShelfId: 1, lastWorkPos: 0, nextShelfId: 2, nextWorkPos: 0 },
          }
        );

        expect(newState.shelves[0].works).to.have.length(1);
        expect(newState.shelves[1].works).to.have.length(1);
      });

      it('should properly handle moving works within a shelf (Y move)', function() {
        const newState = shelfReducer(
          initState, {
            type: types.MOVE_WORK,
            payload: { work: work, lastShelfId: 1, lastWorkPos: 0, nextShelfId: 1, nextWorkPos: 1 },
          }
        );

        expect(newState.shelves[0].works[0].title).to.eq('bar');
        expect(newState.shelves[0].works[1].title).to.eq('foo');
      });
    });

    describe('action: DELETE_WORK', function() {
      it('should properly delete a work', function() {
        const newState = shelfReducer(
          initState, {
            type: types.DELETE_WORK,
            payload: { workId: 1, shelfId: 1 },
          }
        );

        expect(newState.shelves[0].works.length).to.eq(1);
        expect(newState.shelves[0].works[0].title).to.eq('bar');
      });
    });
  });
});
