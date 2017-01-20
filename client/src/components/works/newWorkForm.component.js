import React from 'react'

export default class NewWorkForm extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.addWork = this.props.addWork.bind(this)
    this.closeModal = this.props.closeModal.bind(this)
    this.state = {
      title: '',
      author: '',
      shelfNumber: this.props.shelfNumber
    }
  }

  handleChange(name, event) {
    let change = {}
    change[name] = event.target.value
    this.setState(change)
  }

  handleSubmit(event) {
    event.preventDefault()
    this.addWork(
      {title: this.state.title, author: this.state.author},
      this.state.shelfNumber
    )
    this.resetState()
    this.closeModal()
  }

  resetState() {
    this.setState({
      title: '',
      author: ''
    })
  }

  render() {
    const modalId = 'modal-' + this.props.shelfNumber

    return (
      <div>
        <h1>Add new work</h1>
        <div className="modal-content">
        <fieldset>
        <form onSubmit={this.handleSubmit}>
          <p>
            <label htmlFor={modalId + '-title'}>Title:</label>
            <input
              id={modalId + '-title'}
              type="text"
              value={this.state.title}
              onChange={this.handleChange.bind(this, 'title')}
            />
          </p>
          <p>
            <label htmlFor={modalId + '-author'}>Author:</label>
            <input
              id={modalId + '-author'}
              type="text"
              value={this.state.author}
              onChange={this.handleChange.bind(this, 'author')}
            />
          </p>
          <input type="submit" value="Add new work" />
        </form>
        </fieldset>
        </div>
      </div>
    )
  }
}
