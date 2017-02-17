import React from 'react';
import Shelf from './shelf/shelf.component';

class Biblio extends React.Component {
  render() {
    const { moveWork, addWork, setPlaceholder } = this.props;
    const { shelves, placeholder } = this.props.shelves;

    return (
      <div className="bb-biblio bb-shelf-container">
        {shelves.map(function(shelf) {
          return (
            <Shelf
              key={shelf.id}
              title={shelf.title}
              works={shelf.works}
              shelfNumber={shelf.id}
              addWork={addWork}
              moveWork={moveWork}
              setPlaceholder={setPlaceholder}
              placeholder={placeholder}
            />
          );
        })}
      </div>
    );
  }
}

Biblio.propTypes = {
  shelves: React.PropTypes.object,
  moveWork: React.PropTypes.func,
  addWork: React.PropTypes.func,
  setPlaceholder: React.PropTypes.func,
};

export default Biblio;

