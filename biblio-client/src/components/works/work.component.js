import React from 'react'

export default class Work extends React.Component {
  constructor(props) {
    super(props)
    this.clickDelete = this.clickDelete.bind(this)
  }

  clickDelete(event) {
    if(confirm('Are you sure you want to remove ' + this.props.title + 'from your biblio?')) {
      this.props.deleteWork(this.props.id, this.props.shelfNumber)
    }
  }

  render() {
    return this.props.connectDragSource(
      <div
        className="bb-work"
        id={this.props.id}
      >
        <div className="bb-work-content">
          <h1>{this.props.title}</h1>
          <p>{this.props.author}</p>
        </div>
        <div className="bb-work-delete" onClick={this.clickDelete}>
          🗑
        </div>
      </div>
    )
  }
}
