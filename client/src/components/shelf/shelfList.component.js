import React from 'react';
import WorkContainer from '../../containers/work.container';
import WorkPlaceholder from '../works/workPlaceholder.component';

class ShelfList extends React.Component {
  shouldRenderPlaceholderAbove(ph, shelfNumber, idx) {
    return ph.currentDraggedShelf === shelfNumber &&
      ph.placeholderIndex === idx &&
      (idx !== ph.currentDragged || ph.originShelf !== shelfNumber) &&
      ph.draggedDir === 'up';
  }

  shouldRenderPlaceholderBelow(ph, shelfNumber, idx) {
    return ph.currentDraggedShelf === shelfNumber &&
      ph.placeholderIndex === idx &&
      (idx !== ph.currentDragged || ph.originShelf !== shelfNumber) &&
      ph.draggedDir === 'down';
  }

  render() {
    const { works, shelfNumber, moveWork, setPlaceholder, placeholder } = this.props;
    const shouldRenderPlaceholderAbove = this.shouldRenderPlaceholderAbove;
    const shouldRenderPlaceholderBelow = this.shouldRenderPlaceholderBelow;

    const worksWithPlaceholder = [];
    works.forEach(function(work, idx) {
      if (shouldRenderPlaceholderAbove(placeholder, shelfNumber, idx)) {
        worksWithPlaceholder.push(
          <WorkPlaceholder
            key="placeholder"
            setPlaceholder={setPlaceholder}
            moveWork={moveWork}
            position={idx}
            shelfNumber={shelfNumber}
          />
        );
      }

      worksWithPlaceholder.push(
        <WorkContainer
          id={work.id}
          key={work.id}
          position={idx}
          title={work.title}
          author={work.author}
          moveWork={moveWork}
          shelfNumber={shelfNumber}
          work={work}
          placeholder={placeholder}
          setPlaceholder={setPlaceholder}
        />
      );

      if (shouldRenderPlaceholderBelow(placeholder, shelfNumber, idx)) {
        worksWithPlaceholder.push(
          <WorkPlaceholder
            key="placeholder"
            setPlaceholder={setPlaceholder}
            moveWork={moveWork}
            position={idx}
            shelfNumber={shelfNumber}
          />
        );
      }
    });

    return (
      <div className="bb-shelf-list">
        {worksWithPlaceholder}
      </div>
    );
  }
}

ShelfList.propTypes = {
  works: React.PropTypes.arrayOf(React.PropTypes.object),
  shelfNumber: React.PropTypes.number.isRequired,
  moveWork: React.PropTypes.func,
  setPlaceholder: React.PropTypes.func,
  placeholder: React.PropTypes.object,
};

export default ShelfList;
