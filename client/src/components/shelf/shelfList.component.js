import React from 'react';
import WorkContainer from '../../containers/work.container';

class ShelfList extends React.Component {
  constructor(props) {
    super(props);
    this.setPlaceholder = this.setPlaceholder.bind(this);
    this.state = {
      placeholderIndex: -1,
      currentDragged: -1,
      dragDir: '',
    };
  }

  render() {
    const { works, shelfNumber, moveWork } = this.props;
    const { placeholderIndex, currentDragged, dragDir } = this.state;
    const setPlaceholder = this.setPlaceholder;

    const worksWithPlaceholder = [];
    works.forEach(function(work, idx) {
      if (placeholderIndex === idx && idx !== currentDragged && dragDir === 'up') {
        worksWithPlaceholder.push(<div key="placeholder" className="bb-work bb-work-placeholder" />);
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
          currentPlaceholder={placeholderIndex}
          setPlaceholder={setPlaceholder}
        />
      );
      if (placeholderIndex === idx && idx !== currentDragged && dragDir === 'down') {
        worksWithPlaceholder.push(<div key="placeholder" className="bb-work bb-work-placeholder" />);
      }
    });

    return (
      <div className="bb-shelf-list">
        {worksWithPlaceholder}
      </div>
    );
  }

  setPlaceholder(draggedPosition, hoverPosition, dragDir) {
    this.setState({
      placeholderIndex: hoverPosition,
      currentDragged: draggedPosition,
      dragDir: dragDir,
    });
  }
}

ShelfList.propTypes = {
  works: React.PropTypes.arrayOf(React.PropTypes.object),
  shelfNumber: React.PropTypes.number.isRequired,
  moveWork: React.PropTypes.func,
};

export default ShelfList
