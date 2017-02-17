import React from 'react';

class ShelfTitle extends React.Component {
  render() {
    return (
      <div className="bb-shelf-title">
        <h1>{this.props.text}</h1>
      </div>
    );
  }
}

ShelfTitle.propTyptes = {
  text: React.PropTypes.string.isRequired,
};

export default ShelfTitle;
