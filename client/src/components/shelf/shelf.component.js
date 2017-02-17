import React from 'react';
import ShelfTitle from './shelfTitle.component';
import ShelfList from './shelfList.component';
import NewWork from '../works/newWork.component';

class Shelf extends React.Component {
  render() {
    return (
      <div className="bb-shelf">
        <ShelfTitle text={this.props.title} />
        <NewWork
          addWork={this.props.addWork}
          shelfNumber={this.props.shelfNumber}
        />
        <ShelfList
          shelfNumber={this.props.shelfNumber}
          moveWork={this.props.moveWork}
          addWork={this.props.addWork}
          works={this.props.works}
          placeholder={this.props.placeholder}
          setPlaceholder={this.props.setPlaceholder}
        />
      </div>
    );
  }
}

Shelf.propTypes = {
  title: React.PropTypes.string,
  shelfNumber: React.PropTypes.number,
  addWork: React.PropTypes.func,
  moveWork: React.PropTypes.func,
  placeholder: React.PropTypes.object,
  setPlaceholder: React.PropTypes.func,
  works: React.PropTypes.array,
};

export default Shelf;
